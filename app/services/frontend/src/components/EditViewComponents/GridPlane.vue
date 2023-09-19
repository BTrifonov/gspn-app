<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {watch} from 'vue';
import axios from 'axios';

import * as joint from 'jointjs';


import {useCreateElemStore} from '@/components/stores/EditViewStores/CreateElemStore'
import {useModelStore} from '@/components/stores/ModelStore'


import { useElementStore} from '@/components/stores/EditElementStore';
import { usePlaneStore } from '@/components/stores/PlaneStore';

import { drawPlace } from '@/components/utils/element-generator';
import { drawTransition } from '@/components/utils/element-generator';
import { drawImmediateTransition } from '@/components/utils/element-generator'
import { drawArc } from '@/components/utils/element-generator'

import { createLinkToolView } from '@/components/utils/tool-generator';
import { createElementToolView } from '@/components/utils/tool-generator';

//import { Arc } from '@/components/utils/CustomElements/arc';
//import { validateArc } from './utils/connection-validator';


//TODO: Probably won't be needed, delete later
const container = ref(null)

const plane = ref(null)

const createElemStore = useCreateElemStore()
const modelStore = useModelStore()

const editElementStore = useElementStore()
const planeStore = usePlaneStore()


/*----------------------------*/
const namespace = joint.shapes
const graph = new joint.dia.Graph({}, {cellNamespace:namespace})

let paper = null
let editElementBuf = null
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
   
    //Attach and remove element and link tools
    //----------------------------------------------------------
    const linkToolView = createLinkToolView()
    const elementToolView = createElementToolView()

    paper.on('link:mouseenter', function(linkView) {
        linkView.addTools(linkToolView)
    })

    paper.on('link:mouseleave', function(linkView) {
        linkView.removeTools()
    })
    
    paper.on('element:pointerclick', function(elementView) {
        const model = elementView.model
        
        elementView.addTools(elementToolView)
        if(model.attributes.type === 'custom.Place') {
            editElementStore.selectPlace()
            editElementBuf = model
        } else if(model.attributes.type === 'custom.Transition')  {
            editElementStore.selectTransition()
            editElementBuf = model
        }
    })

    /*paper.on('cell:pointerclick', function(view) {
        const model = view.model

        if(model instanceof joint.shapes.standard.Link) {
            view.addTools(linkToolView)
            
            //editElementStore.setArc(model)
        }
        else {
            view.addTools(elementToolView)

            if(model instanceof joint.shapes.standard.Circle) {
                editElementStore.selectPlace(model)
            }
            else {
                //editElementStore.setTransition(model)
            }
        }
    })*/

    paper.on('blank:pointerclick', function() {
        paper.removeTools()
        editElementStore.unselectAll()
    })

    paper.on('blank:pointerdblclick', function() {
        planeStore.editPlaneEnabled = !planeStore.editPlaneEnabled
    })
    
    paper.on('element:mouseenter', function(elementView) {
        const element = elementView.model
        const ports = element.getPorts()

        for(const port of ports) {
            const portId = port.id
            element.portProp(portId, 'attrs/body/visibility', 'visible')
        }
    })

    paper.on('element:mouseleave', function(elementView) {
        const element = elementView.model
        const ports = element.getPorts()

        for(const port of ports) {
            const portId = port.id
            element.portProp(portId, 'attrs/body/visibility', 'hidden')
        }
    })
    

    /**TODO: Should be used for creating a port on the target element */
    // eslint-disable-next-line
    paper.on('link:connect', function(linkView, evt, elementViewConnected, magnet, arrowhead) {
        //const link = linkView.model

        //const sourceElement = link.get('source')
        //const targetElement = link.get('target')
        
        //const sourcePort = link.get('source').port
        //const targetPort = link.get('target').port
        
       
    })


    /**Change paper size whenever element is outside the paper*/
    paper.on('element:pointerup', function(elementView) {
        const elementSize = elementView.getBBox()
        const paperSize = paper.getComputedSize()
        
        /*Increase paper width and translate right, when element dragged to the left outside the paper*/
        if(elementSize.x < 0) {
            const dx = Math.abs(elementSize.x)

            paper.setDimensions(paperSize.width + dx, paperSize.height)
            paper.translate(dx + paper.options.origin.x, 0)
        }

        /*Increase paper width and translate left, element dragged to the right outside the paper*/
        if(elementSize.x + elementSize.width > paperSize.width) {
            const dx = (elementSize.x + elementSize.width) - paperSize.width

            paper.setDimensions(paperSize.width + dx, paperSize.height)
            paper.translate(- dx + paper.options.origin.x, 0)
        }


        /**TODO: Functionality for vertical paper increase does not work, probably CSS issue */
        
        /*Increase paper height and translate downwards, element dragged to the top outside the paper*/
        if(elementSize.y < 0) {
            const dy = Math.abs(elementSize.y)
            console.log("dist:" + dy)

            paper.setDimensions(paperSize.width, paperSize.height + dy)
            paper.translate(0, dy + paper.options.origin.y)
        }

        /*Increase paper height and translate upwards, element dragged to the bottom outside the paper*/
        if(elementSize.y + elementSize.height > paperSize.height) {
            const dy = (elementSize.y + elementSize.height) - paperSize.height
            console.log("dist: " + dy)

            paper.setDimensions(paperSize.width, paperSize.height + dy)
            paper.translate(0, - dy + paper.options.origin.y)
        }
    })
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
//User interaction with the EditElementMenu 
//----------------------------------------------------------
editElementStore.$onAction(({
    name, 
    store, 
    args, 
    after, 
}) => {
    after((res)=> {
        if(name === "setPlaceLabel") {
            const label = args[0]
            editElementBuf.attr('label/text', label)

        } else if(name === "setPlaceTokenNumber") {
            const tokenNumber = args[0]
            editElementBuf.attr('tokenNumber/text', tokenNumber)
            editElementBuf.prop('avgTokens', tokenNumber)

        } else if(name === "deletePlace") {
            editElementBuf.remove()

        } else if(name === "setTransitionLabel") {
            const label = args[0]
            editElementBuf.attr('label/text', label)

        } else if(name === "setTransitionDistribution") {
            const distributionType = args[0]
            editElementBuf.prop('tokenDistribution', distributionType)

        } else if(name === "setTransitionRate") {
            const rate = args[0]
            editElementBuf.prop('rate', rate)

        } else if(name === "deleteTransition") {
            editElementBuf.remove()
        }
    })
})

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