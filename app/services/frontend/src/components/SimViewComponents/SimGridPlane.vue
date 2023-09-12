<script setup>
import {ref, onMounted, watch} from 'vue'


import {useModelStore} from '@/components/stores/ModelStore'



import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore'

//import { useEnabledTransitionsStore } from '@/components/stores/SimViewStores/EnabledTransitionsStore'
//import { useSimMenuStore } from '@/components/stores/SimViewStores/SimMenuStore'

import * as joint from 'jointjs'
import axios from 'axios';


//-----------------------------------------------
//Stores instantiations
//-----------------------------------------------
const simulationStore = useSimulationStore()
const modelStore = useModelStore()

//const enabledTransitionsStore = useEnabledTransitionsStore()
//const simMenuStore = useSimMenuStore()

let socket = new WebSocket("ws://localhost:5000/ws/123")

const plane = ref(null)
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
    })


    //Transfer the names of all models from the model store in the edit view to sim view
    modelStore.unselectAllModels()
    simulationStore.setModels(modelStore.getModels)
})

//---------------------------------------------------
//User interaction with the SimModelMenu
//---------------------------------------------------
simulationStore.$onAction(({
    name, 
    store, 
    args, 
    after, 
    onError
}) => {
    after((result)=> {
        if(name === "selectModel") {
            graph.fromJSON(result)

            simulationStore.findEnabledTransitions()
        } else if(name === "unselectModel") {
            graph.clear()
        } else if(name === "fireTransition") {
            //1.Show visually what's happenning
            const transitionId = args[0].id
            animateSimulation(result.input_places, result.output_places, transitionId)
            //----------------------------------

        } else if(name === "findEnabledTransitions") {
            const idsEnabledTransitions = result

            const enabledTransitions = findLabelsEnabledTransitions(idsEnabledTransitions)
            simulationStore.setEnabledTransitions(enabledTransitions)
        }
    })
})

/*
watch(() => simulationStore.findEnabledTransitions, (newVal) => {
    if(newVal) {
        const modelName = simulationStore.getSelectedModelName

        const params = {
            name: modelName
        }

        axios.get('model/enabled-transitions', {params})
                .then(function(response) {
                    const idsEnabledTransitions = response.data
                    const enabledTransitions = findLabelsEnabledTransitions(idsEnabledTransitions)

                    simulationStore.setEnabledTransitions(enabledTransitions)
                })
                .catch(function(error) {
                    console.log(error)
                })
                .finally(function() {
                    //
                })


        simulationStore.findEnabledTransitions = false
    }
})*/


//---------------------------------------------------
//User interaction with the SimEnabledTransitionsMenu
//---------------------------------------------------

//------------------------------------------------------
//User interaction with the SimulationMenu
//------------------------------------------------------
/*simMenuStore.$onAction(({
    name, 
    store,
    args, 
    after, 
    onError
}) => {
    if(name==="startButton") {
        socket.onopen = function(event) {
            console.log("Connection established")
        }

        socket.send("Welcome on board!")
        socket.send("How are you!")

        socket.onmessage = function(event) {
            console.log(event)
        }
    }
})*/


//---------------------------------------------------
//Helper methods
//---------------------------------------------------
function findLabelsEnabledTransitions(idTransitions) {
    const enabledTransitions = []
    for(let i = 0;i < idTransitions.length;i++) {
        const cell = graph.getCell(idTransitions[i])
        const label = cell.attr('label/text')
        enabledTransitions.push({id: idTransitions[i], label: label})
    }
    return enabledTransitions
}

function highlightEnabledTransitions(idTransitions) {
    for(let i = 0; i < idTransitions.length;i++) {
        const cell = graph.getCell(idTransitions[i])
        const cellView = paper.findViewByModel(cell)
        cellView.highlight()
    }
}

function animateSimulation(inputPlaces, outputPlaces, transitionId) {
    for(const inputPlace of inputPlaces) {
        const cell = graph.getCell(inputPlace.id)
        const cellView = paper.findViewByModel(cell)

        setTimeout(()=>{
            highlightUnhighlightElement(inputPlace.tokens, cell, cellView)
        }, 1000)
    }
    for(const outputPlace of outputPlaces) {
        const cell = graph.getCell(outputPlace.id)
        const cellView = paper.findViewByModel(cell)

        setTimeout(()=>{
            highlightUnhighlightElement(outputPlace.tokens, cell, cellView)
        }, 1000)
    }
}

function highlightUnhighlightElement(token, cell, cellView) {
    cellView.highlight()
    cell.attr('tokenNumber/text', token)
    setTimeout(()=> {cellView.unhighlight()}, 1000)
}
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