<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {watch} from 'vue';

import * as joint from 'jointjs';

import {useCreateElemStore} from '@/components/stores/EditViewStores/CreateElemStore.js'
import {useModelStore} from '@/components/stores/ModelStore.js'

import { useElementStore} from '@/components/stores/EditElementStore.js';
import { usePlaneStore } from '@/components/stores/EditViewStores/EditPlaneStore.js';

import { drawPlace, drawTransition, drawImmediateTransition, drawArc } from '@/components/EditViewComponents/utils/element-generator.js';

import {validateConnection, selectCell, attachLinkTools, showLinkPorts, hideLinkPorts} from '@/components/EditViewComponents/utils/paper-events.js'

import {unselectAllElements, selectPaper, resizePaper} from '@/components/EditViewComponents/utils/paper-events.js'

import {translatePaper} from '@/components/EditViewComponents/utils/paper-events.js'


import {saveModel, updateModel, deleteModel, selectModel} from '@/components/EditViewComponents/utils/requests.js'

//------------------------------------------
//Ref attributes, binded to HTML DOMs
//------------------------------------------
const container = ref(null)
const plane = ref(null)

//------------------------------------------
//Store instantiations
//------------------------------------------
const createElemStore = useCreateElemStore()
const modelStore = useModelStore()

const editElementStore = useElementStore()
const planeStore = usePlaneStore()

//--------------------------------------------------------
//Attributes for the paper creation and element numeration
//--------------------------------------------------------
const namespace = joint.shapes
const graph = new joint.dia.Graph({}, {cellNamespace:namespace})
let paper = null

let transitionIndex = 0
let placeIndex = 0
let arcIndex = 0
//------------------------------------------
// Lifecycle hook methods and event handlers
//------------------------------------------
onMounted(()=> {
    paper = new joint.dia.Paper({
        el: plane.value, 
        model: graph, 
        height: '100%', 
        width: '100%',
        drawGrid: 'mesh',
        gridSize: 5,
        cellViewNamespace: namespace,
        defaultLink: () => drawArc(arcIndex++),
        validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView),
        markAvailable: true,
        linkPinning: false
    })
   
    //-----------------------------------------
    //Set the origin of the paper to the middle of the plane
    //-----------------------------------------
    const paperHeight = paper.options.height; // Height in pixels
    const paperWidth = paper.options.width;
    paper.translate(paperWidth / 2, paperHeight / 2)


    //------------------------------------------
    //Cell events (Element or link)
    //------------------------------------------
    paper.on('cell:pointerclick', (cellView) => selectCell(paper, editElementStore, cellView))

    //------------------------------------------
    //Link events
    //------------------------------------------
    paper.on('link:pointerdblclick', (linkView)=> attachLinkTools(linkView))

    //------------------------------------------
    //Element events
    //------------------------------------------
    paper.on('element:mouseenter', (elementView) => showLinkPorts(elementView))
    paper.on('element:mouseleave', (elementView) => hideLinkPorts(elementView))

    //------------------------------------------
    //Blank paper and resizing events
    //------------------------------------------
    paper.on('blank:pointerclick', () => unselectAllElements(paper, editElementStore))
    paper.on('blank:pointerdblclick', () => selectPaper(planeStore))
    paper.on('element:pointerup', (elementView) => resizePaper(paper, elementView))
    paper.on('blank:pointermove', (evt, x, y)=> translatePaper(evt, x, y, paper))
})

//onUnmounted unselect all Models
onUnmounted(()=>{
    modelStore.unselectAllModels()
})

//----------------------------------------------------------
//User interaction with the CreateElemMenu
//----------------------------------------------------------
createElemStore.$onAction(({
    name, 
    store, 
    args, 
    after 
}) => {
        //Buttons are set to false after an element has been drawn, therefore return in this case
        if(!args[0])
            return

        after((res)=> {
            switch(name) {
                case "setPlaceButton": {
                    const place = drawPlace(placeIndex++)   
                    place.addTo(graph)
                    store.setPlaceButton(false)
                    break
                }
                case "setTransitionButton": {
                    const rect = drawTransition(transitionIndex++)
                    rect.addTo(graph)
                    store.setTransitionButton(false)
                    break
                }
                case "setImmediateTransitionButton": {
                    const rect = drawImmediateTransition(transitionIndex++)
                    rect.addTo(graph)
                    store.setImmediateTransitionButton(false)
                    break
                }
                default: {
                    break;
                }
            }
        })
})

//---------------------------------------------------------
//Event handlers by user interaction with the StoreModelMenu
//---------------------------------------------------------
modelStore.$onAction(({
    name, 
    store, 
    args, 
    after, 
    onError
}) => {
    /*Executed user request transmitted by the modelStore*/
    after((result)=> {
        if(name === "saveModel") {
            const modelName = args[0]
            const modelJSON = graph.toJSON()

            saveModel(modelName, modelJSON)
                .then((response)=>{
                    console.log(response)
                })
            
            modelStore.updateModelElementCount(modelName, transitionIndex, placeIndex, arcIndex)
            transitionIndex = 0
            placeIndex = 0
            arcIndex = 0

            graph.clear()
        } else if(name === "updateModel") {
            const modelName = args[0].name
            const modelJSON = graph.toJSON()

            updateModel(modelName, modelJSON)
                .then((response)=>{
                    console.log(response)
                })

            modelStore.updateModelElementCount(modelName, transitionIndex, placeIndex, arcIndex)
            transitionIndex = 0
            placeIndex = 0
            arcIndex = 0

            //unselect model
            modelStore.unselectModel(args[0])
        } else if(name === "deleteModel") {
            const modelName = args[0].name

            deleteModel(modelName)
                .then((response)=>{
                    console.log(response)
                })
            
            graph.clear()
        } else if(name === "selectModel") {
            if(!result) 
                throw Error("Result missing")
            
            const modelName = args[0].name
            
            transitionIndex = args[0].transitionCount
            placeIndex = args[0].placeCount
            arcIndex = args[0].arcCount

            selectModel(modelName)
                .then((response)=>{
                    graph.fromJSON(response.model)
                })
                .catch((err)=>{
                    alert("An error occured, while selecting model " + modelName + ":" + err)
                })
        } else if(name === "unselectModel") {
            if(!result)
                throw Error("Result missing")
        

            transitionIndex = 0
            placeIndex = 0
            arcIndex = 0

            //no need for axios request, just clear the plane
            graph.clear()
        } 
    })
})

//---------------------------------------------------------
// Event handlers by user interaction with the EditPlaneMenu
//---------------------------------------------------------
watch(()=> planeStore.paperGrid, (newValue) => {
    if(newValue === 'None') {
        paper.setGrid('false')
    } else if(newValue === 'Dot') {
        paper.setGrid('dot')
        paper.drawGrid()
    } else if(newValue === 'Mesh') {
        paper.setGrid('mesh')
        paper.drawGrid()
    } else if(newValue === 'DoubleMesh') {
        paper.setGrid(
            {
            name: 'doubleMesh',
            args: [
                { 
                    color: 'grey', 
                    thickness: 1
                }, 
                { 
                    color: 'darkgrey', 
                    scaleFactor: 10, 
                    thickness: 3 
                } 
            ]
        }
        )
        paper.drawGrid()
    }
})

watch(()=> planeStore.paperGridSize, (newValue) => {
    paper.setGridSize(newValue)
})

watch(()=> planeStore.paperScale, (newValue)=> {
    paper.scale(newValue)
})
</script>

<template>
    <div class="plane-container" ref="container">
        <div class="plane" ref="plane"></div>
    </div>
</template>

<style scoped>
@import '@/assets/grid-plane-structure.css';
</style>

<!--TODO: If this style is added from external file, does not work-->
<style>
.available-magnet {
    visibility: visible;
}
</style>