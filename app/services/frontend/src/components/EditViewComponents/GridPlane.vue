<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {watch} from 'vue';
import axios from 'axios';

import * as joint from 'jointjs';


import {useCreateElemStore} from '@/components/stores/EditViewStores/CreateElemStore'
import {useModelStore} from '@/components/stores/ModelStore'


import { useElementStore} from '@/components/stores/EditElementStore';
import { usePlaneStore } from '@/components/stores/EditViewStores/EditPlaneStore';

import { drawPlace } from '@/components/utils/element-generator';
import { drawTransition } from '@/components/utils/element-generator';
import { drawImmediateTransition } from '@/components/utils/element-generator'
import { drawArc } from '@/components/utils/element-generator'

import { createLinkToolView } from '@/components/utils/tool-generator';
import { createElementToolView } from '@/components/utils/tool-generator';


import {attachLinkToolsOnMouseEnter, detachLinkToolsOnMouseLeave} from '@/components/EditViewComponents/utils/paper-events.js'
import {selectElement, showLinkPorts, hideLinkPorts} from '@/components/EditViewComponents/utils/paper-events.js'

import {unselectAllElements, selectPaper, resizePaper} from '@/components/EditViewComponents/utils/paper-events.js'

//import { Arc } from '@/components/utils/CustomElements/arc';
//import { validateArc } from './utils/connection-validator';

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

//------------------------------------------
//Attributes for the paper creation
//------------------------------------------
const namespace = joint.shapes
const graph = new joint.dia.Graph({}, {cellNamespace:namespace})
let paper = null

onMounted(()=> {
    paper = new joint.dia.Paper({
        el: plane.value, 
        model: graph, 
        height: '100%', 
        width: '100%',
        drawGrid: 'mesh',
        gridSize: 5,
        cellViewNamespace: namespace,
        defaultLink: () => new joint.shapes.standard.Link(),
        /**TODO: Validation does not work, use the connection-validator */
        //validateConnection: 
        markAvailable: true,
        //By setting this it is not able to use the create arc option
        linkPinning: false
    })
   
    //------------------------------------------
    //Link events
    //------------------------------------------
    paper.on('link:mouseenter', (linkView) => attachLinkToolsOnMouseEnter(linkView))
    paper.on('link:mouseleave', (linkView) => detachLinkToolsOnMouseLeave(linkView))
    
    //------------------------------------------
    //Element events
    //------------------------------------------
    paper.on('element:pointerclick', (elementView) => selectElement(paper, editElementStore, elementView))
    paper.on('element:mouseenter', (elementView) => showLinkPorts(elementView))
    paper.on('element:mouseleave', (elementView) => hideLinkPorts(elementView))

    //------------------------------------------
    //Blank paper and resizing events
    //------------------------------------------
    paper.on('blank:pointerclick', () => unselectAllElements(paper, editElementStore))
    paper.on('blank:pointerdblclick', () => selectPaper(planeStore))
    paper.on('element:pointerup', (elementView) => resizePaper(paper, elementView))
})


//onUnmounted unselect all Models
onUnmounted(()=>{
    modelStore.unselectAllModels()
})

//Create a PN place, transition or arc
function createPlace() {
    const place = drawPlace()   
    
    place.addTo(graph)
}

function createTransition() {    
    const rect = drawTransition()
    
    rect.addTo(graph)
}

function createImmediateTransition() {
    const rect = drawImmediateTransition()
    rect.addTo(graph)
}

function createArc() {
    const arc = drawArc()
    arc.addTo(graph)
}

//----------------------------------------------------------
//
//----------------------------------------------------------
//User interaction with the CreateElemMenu

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
                    createPlace()
                    store.setPlaceButton(false)
                    break
                }
                case "setTransitionButton": {
                    createTransition()
                    store.setTransitionButton(false)
                    break
                }
                case "setImmediateTransitionButton": {
                    createImmediateTransition()
                    store.setImmediateTransitionButton(false)
                    break
                }
                case "setArcButton": {
                    createArc()
                    store.setArcButton(false)
                    break
                }
                default: {
                    break;
                }
            }
        })
})

//---------------------------------------------------------
//
//---------------------------------------------------------
//User interaction with the StoreModelMenu
modelStore.$onAction(({
    name, 
    store, 
    args, 
    after, 
    onError
}) => {
    /**TODO: All the requests should be executed here!!!! */
    /*Executed after modification of the store*/
    after((result)=> {
        if(name === "saveModel") {
            const modelName = args[0]
            const modelJSON = graph.toJSON()

            const data = {
                model: modelJSON
            }

            const params = {
                name: modelName
            }

            axios.post('/model', { data, params })
                    .then(function(response) {
                        console.log("Saved successfully model: " + modelName)
                        return true
                    })
                    .catch(function (err) {
                        console.log("The following error occured:" + err)
                        return false
                    })  
                    .finally(function() {
                        
                    })

            graph.clear()
        } else if(name === "updateModel") {
            const model = args[0]
            const modelName = model.name
            const modelJSON = graph.toJSON()

            const data = {
                model: modelJSON
            }

            const params = {
                name: modelName
            }

            axios.put('/model', {data, params})
                .then(function(response) {
                    console.log("Updated successfully model: " + modelName)
                    return true
                })
                .catch(function(err) {
                    console.log("Following error occured, while updating model " + modelName + ": " + err)
                })
                .finally(function() {
                    //
                })
        } else if(name === "deleteModel") {
            const model = args[0]
            const modelName = model.name

            const params = {
                name:modelName
            }

            axios.delete('/model', {params})
                .then(function(response) {
                    console.log("Deleted successfully model: " + modelName)

                    graph.clear()
                })
                .catch(function(err) {
                    console.log("Following error occured, while deleting model " + modelName + ": " + err)
                })
                .finally(function() {
                    //
                })

        } else if(name === "selectModel") {
            if(!result) 
                throw Error("Result missing")
            
            const model = args[0]

            const params = {
                name: model.name
            }

            axios.get('/model', {params})
                    .then(function(response) {test(model, response)})
            .catch(function(err) {
                console.log("An error occured" + err)
            })
            .finally(function() {
                //
            })
        } else if(name === "unselectModel") {
            if(!result)
                throw Error("Result missing")

            graph.clear()
        } 
    })
})

function test(model, response) {
                        console.log("Fetch the model with name: " + model.name)
                   
                        const modelJSON = JSON.parse(response.data)
                
                        graph.fromJSON(modelJSON.model)
                    }


//---------------------------------------------------------
//TODO: Should be made as the CreateElemMenu instead of watchers
//---------------------------------------------------------
// Watchers for user interaction with the edit plane menu
watch(()=> planeStore.paperGrid, (newValue) => {
    //TODO: This functionality could be delegated to a function, however paper should be passed as argument
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

watch(()=> planeStore.triggerDelete, (newValue)=> {
    if(newValue) {
        //Delete the graph from the plane
        graph.clear()

        //Delete the locally saved file in the backend
        axios.delete('/model')
                .then(function(response) {
                    console.log("Deleted successfully the model!")
                })
                .catch(function(err) {
                    console.log("Error occured while deleting the model")
                })
                .finally(function() {
                    //
                })
        
        
        
        planeStore.triggerDelete = false
    }
})
//---------------------------------------------------------

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