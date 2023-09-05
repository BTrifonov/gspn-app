
<script setup>
import {ref, onMounted} from 'vue';
import {watch} from 'vue';
import {reactive} from 'vue';
import axios from 'axios';

import * as joint from 'jointjs';

import { useTriggerStore } from '@/components/stores/TriggerStore';
import { useElementStore} from '@/components/stores/ElementStore';
import { usePlaneStore } from '@/components/stores/PlaneStore';

import { drawPlace } from '@/components/utils/element-generator';
import { drawTransition } from '@/components/utils/element-generator';
import { drawImmediateTransition } from '@/components/utils/element-generator'
import { drawArc } from '@/components/utils/element-generator'

import { createLinkToolView } from '@/components/utils/tool-generator';
import { createElementToolView } from '@/components/utils/tool-generator';
import { Arc } from '@/components/utils/CustomElements/arc';


//import { validateArc } from './utils/connection-validator';


//TODO: Probably won't be needed, delete later
const container = ref(null)

const styleContainer = reactive({
  //width: '100%',
  //height: '100%',
})


const plane = ref(null)

const triggerStore = useTriggerStore()
const elementStore = useElementStore()
const planeStore = usePlaneStore()

//TODO: Here should be added all custom shapes
//const namespace = {...joint.shapes, custom: {Place, Transition}}
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
        defaultLink: () => new Arc(),
        /**TODO: Validation does not work, use the connection-validator */
        //validateConnection: 
        markAvailable: true
    })
   
    //Attach and remove element and link tools
    //----------------------------------------------------------
    const linkToolView = createLinkToolView()
    const elementToolView = createElementToolView()

    paper.on('cell:pointerclick', function(view) {
        elementStore.selectedArc = null
        elementStore.selectedPlace = null
        elementStore.selectedTransition = null

        const model = view.model

        if(model instanceof joint.shapes.standard.Link) {
            view.addTools(linkToolView)
            elementStore.selectedArc = model
        }
        else {
            view.addTools(elementToolView)

            if(model instanceof joint.shapes.standard.Circle) {
                elementStore.selectedPlace = model
            }
            else {
                elementStore.selectedTransition = model
            }
        }
    })

    paper.on('blank:pointerclick', function() {
        paper.removeTools()
        elementStore.selectedArc = null
        elementStore.selectedPlace = null
        elementStore.selectedTransition = null
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
//Watchers for user interaction with the draw menu

watch(()=> triggerStore.placeTrigger, (value) => {
    if(value) {
        createPlace()
        triggerStore.placeTrigger = false
    }
})

watch(() => triggerStore.transitionTrigger, (value) => {
    if(value) {
        createTransition()
        triggerStore.transitionTrigger = false
    }
})

watch(() => triggerStore.immediateTransitionTrigger,(value) => {
    if(value) {
        createImmediateTransition()
        triggerStore.immediateTransitionTrigger = false
    }
})

watch(() => triggerStore.connectTrigger, (newValue) => {
    if(newValue) {
        createArc()
        triggerStore.connectTrigger = false
    }
})

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

watch(() => planeStore.triggerSave, (newValue)=> {
    if(newValue) {
        const jsonGraph = graph.toJSON()

        axios.post('/model', {
            model: jsonGraph
        })
            .then(function(response) {
                console.log("Submitted successfully the following model:")
                console.log(jsonGraph)
            })
            .catch(function (err) {
                console.log("Lately an error")
            })
            .finally(function() {
                //
            })
        
        planeStore.triggerSave = false
    }
})
//---------------------------------------------------------

</script>

<template>
    <div class="main-container" ref="container" :style="styleContainer">
        <div class="plane" ref="plane"></div>
    </div>
</template>

<style scoped>
.plane {
    min-width: 100%;
    min-height: 100%;
}
.main-container {
    min-height: 100%;
    min-width: 100%;

    display: flex;
    position: relative;

 
    padding: 0px;
    overflow: auto;
}

/**TODO: Either import as external stylesheet or use addition */
/*@import '../assets/availablePorts.css'*/
</style>

<style>
.available-magnet {
    visibility: visible;
}


.available-cell rect {
    fill: 'red';
}
</style>