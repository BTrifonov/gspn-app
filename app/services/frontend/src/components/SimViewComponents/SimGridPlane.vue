<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue'


import {useModelStore} from '@/components/stores/ModelStore'
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore'


import {getModel, fireTransition, findEnabledTransitions} from '@/components/SimViewComponents/requests.js'
import {transitionFiringAnimationAlternate, transitionFiringAnimation} from '@/components/SimViewComponents/simAnimation.js'
import {createSocket, closeSocket, receiveMsg, sendMsg} from '@/components/SimViewComponents/socketCommunication.js'

import * as joint from 'jointjs'
import axios from 'axios';


//-----------------------------------------------
//Store instantiations
//-----------------------------------------------

const simulationStore = useSimulationStore()
const modelStore = useModelStore()

//-----------------------------------------------

//-----------------------------------------------
//Socket instantiation
//-----------------------------------------------

//Socket should be opened only in auto sim mode

let socket = null

//-----------------------------------------------

//-----------------------------------------------
//JointJS relevant variable instantiations
//-----------------------------------------------

const plane = ref(null)
const namespace = joint.shapes
const graph = new joint.dia.Graph({}, {cellNamespace:namespace})
let paper = null

//-----------------------------------------------
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

    //-------------------------------------------------
    const boundaryTool = new joint.elementTools.Boundary()
    
    const toolView = new joint.dia.ToolsView({
        tools: [
            boundaryTool
        ]
    })

    paper.on('element:pointerclick', function(elementView) {
        const model = elementView.model
        elementView.addTools(toolView)
        if(model.attributes.type === 'custom.Place') {
            simulationStore.selectedPlace = model
            simulationStore.isPlaceSelected = true

        }
    })

    paper.on('blank:pointerclick', function(elementView) {
        paper.removeTools()
        simulationStore.isPlaceSelected = false
        simulationStore.selectedPlace = null
    })
})

onUnmounted(()=>{
    //Unselect all models from the menu
    simulationStore.unselectAllModels()
})

//-------------------------------------------------------
// Selecting and unselecting model from the SimModelMenu
//-------------------------------------------------------
simulationStore.$onAction(({
    name, 
    store, 
    args, 
    after, 
    onError
})=>{
    after((res)=>{
        if(name === "selectModel") {
            //Fetch the model based on the model.name
            const model = args[0]
            
            getModel({name: model.name})
                .then((response) => {
                    simulationStore.resetAllButtons()
                    const modelJSON = JSON.parse(response)

                    graph.fromJSON(modelJSON.model)
                    simulationStore.findEnabledTransitions()
                })
                .catch((error) => {
                    console.error(error)
                })
                .finally(()=> {
                    //always executed
                })
        } else if(name === "unselectModel") {
            simulationStore.resetAllButtons()
            simulationStore.setSimulationTime(0)

            graph.clear()
        }
    })
})

//-------------------------------------------------------
// Actions triggered in manual simulation mode
//-------------------------------------------------------
simulationStore.$onAction(({
    name, 
    store, 
    args, 
    after
})=> {
    after((res)=>{
        if(name === "fireTransition") {
            const data = {
                model: graph.toJSON()
            }

            const params = {
                name: simulationStore.getSelectedModelName, 
                transition_id: args[0].id
            }

            fireTransition(params, data)
                .then((response)=>{
                    const inputPlaces = response.input_places
                    const outputPlaces = response.output_places
                    const transitions = response.transition_id
                    const delay = response.delay

                    transitionFiringAnimation(inputPlaces, outputPlaces, transitions, graph, paper)
                        .then((response)=>{
                            console.log("Successful animation")

                            if(delay > -1) 
                                simulationStore.setSimulationTime(simulationStore.getSimulationTime + delay)

                            simulationStore.findEnabledTransitions()

                        })
                        .catch((error)=>{
                            console.error(error)
                        })
                    
                })           
        } else if(name === "findEnabledTransitions") {
            const modelJSON = graph.toJSON()

            const data = {
                model: modelJSON
            }

            const params = {
               name: "",
               transition_id: ""
            }

            findEnabledTransitions(params, data)
                .then((response)=>{
                    const idsEnabledTransitions = response
                    const enabledTransitions = findLabelsEnabledTransitions(idsEnabledTransitions)
                    simulationStore.setEnabledTransitions(enabledTransitions)
                })
                .catch((error)=>{
                    console.error(error)
                })
        }
    })
})

//-------------------------------------------------------
// Actions triggered in automatic simulation mode
//-------------------------------------------------------
watch(()=>simulationStore.automaticSimulation, (newVal, oldVal)=>{
    if(newVal) {
        //Ensure the socket is initialized and start communication
        startCommunication()
            .then(()=>{
                socket.onmessage = handleIncomingMsg

                //send a greeting message to the backend
                sendMessage(socket, {action:'greet', status:'ok', data: ""})
            })
    } else {
        if(oldVal) {
            //close the websocket connection, inform the backend
            sendMessage(socket, {action: 'goodbye', status:'ok', data: ""})
                .then(()=>{
                    stopCommunication()
                })
        }
    }
})

//---------------------------------------------------
//Helper methods
//---------------------------------------------------
function calcAvgTokens(cell) {
    const inputPlaceCounter = cell.prop('inputPlaceCounter')
    const outputPlaceCounter = cell.prop('outputPlaceCounter')
    const oldAvgTokens = cell.prop('avgTokens')

    const inputOutputCount = inputPlaceCounter + outputPlaceCounter
    
    console.log("Previous avg token number is: " + oldAvgTokens)

    console.log("Total counter number is: " + inputOutputCount)
    const tokens = cell.attr('tokenNumber/text')
    
    console.log("Current token number is: " + tokens)
    console.log("---------------------------------------")


    const newAvgTokens = (oldAvgTokens * (inputOutputCount+1) + tokens) / (inputOutputCount+2)
    
    
    cell.prop('avgTokens', newAvgTokens)
}

function findLabelsEnabledTransitions(idTransitions) {
    const enabledTransitions = []
    for(let i = 0;i < idTransitions.length;i++) {
        const cell = graph.getCell(idTransitions[i])
        const label = cell.attr('label/text')
        enabledTransitions.push({id: idTransitions[i], label: label})
    }
    return enabledTransitions
}

//---------------------------------------------------
//Helper methods, websocket communication
//---------------------------------------------------
async function startCommunication() {
    try {
        socket = await createSocket()
    }catch(error) {
        console.error(error)
    }
}
async function stopCommunication() {
    try {
        await closeSocket(socket)
    }catch(error) {
        console.error(error)
    }
}
async function sendMessage(socket, msg) {
    await sendMsg(socket, msg)
}

function handleIncomingMsg(event) {
    receiveMsg(event)
        .then((response)=>{
            console.log(response)
        })
        .catch((error)=>{
            console.log(error)
        })
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