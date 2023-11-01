<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue'


import {useModelStore} from '@/components/stores/ModelStore.js'
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore.js'
import { usePlaneStore } from '@/components/stores/EditViewStores/EditPlaneStore.js';

import {getModel, fireTransition, findEnabledTransitions} from '@/components/SimViewComponents/utils/requests.js'
import {transitionFiringAnimationAlternate, transitionFiringAnimation} from '@/components/SimViewComponents/utils/simAnimation.js'
import {createSocket, closeSocket, isSocketOpen, receiveMsg, sendMsg} from '@/components/SimViewComponents/socketCommunication.js'

import * as joint from 'jointjs'
import axios from 'axios';


//-----------------------------------------------
//Store instantiations
//-----------------------------------------------

const simulationStore = useSimulationStore()
const modelStore = useModelStore()

const planeStore = usePlaneStore()

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

    //Set the paper grid and scale with the values from the plane store
    paper.scale(planeStore.paperScale)

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

                    //Find enabled transitions should be triggered when manual simulation is chosen
                    //simulationStore.findEnabledTransitions()
                })
                .catch((error)=>{
                    console.error("The following error occured, while fetching model: " + error)
                })
        } else if(name === "unselectModel") {
            simulationStore.resetAllButtons()
            simulationStore.setSimulationTime(0)

            graph.clear()
        }
    })
})

//-------------------------------------------------------
// Event handling in manual simulation mode
//-------------------------------------------------------
watch(()=>simulationStore.manualSimulation, (newVal, oldVal)=>{
    if(newVal) {
        //user request for a manual simulation
        //update the list of enabled transitions
        simulationStore.findEnabledTransitions()
    }
})

simulationStore.$onAction(({
    name, 
    store, 
    args, 
    after
})=> {
    after((res)=>{
        if(name === "fireTransition") {
            const transition = args[0]
            const data = {
                model: graph.toJSON()
            }

            const params = {
                name: simulationStore.getSelectedModelName, 
                transition_id: transition.id
            }

            fireTransition(params, data)
                .then((response)=>{
                    const inputPlaces = response.input_places
                    const outputPlaces = response.output_places
                    const transitions = response.transition_id
                    const delay = response.delay

                    transitionFiringAnimation(inputPlaces, outputPlaces, transitions, graph, paper, simulationStore.simSpeed)
                        .then((response)=>{
                            console.log("Successful animation")

                            if(delay > -1) 
                                simulationStore.setSimulationTime(simulationStore.getSimulationTime + delay)


                            //update the traceback
                            const placeMarking = findPlaceMarking()
                            simulationStore.updateTraceback(transition, placeMarking)
                            
                            //update the enabled transitions
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
// Events handling in case of automatic simulation
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

watch(()=>simulationStore.startSim, (newVal)=> {
    if(newVal) {
        if(isSocketOpen(socket)) {
            //First the model should be created in the backend
            sendMessage(socket, {action: 'create_model', status:'ok', data: graph.toJSON()})
        } else {
            console.error("Missing connection to socket, cannot start simulation")
        }
    }
})

/**
 * Continue the simulation
 */
watch(()=>simulationStore.continueSim, (newVal)=>{
    if(newVal) {
        if(isSocketOpen(socket)) {
            const payload = {
                sim_step: simulationStore.withTimeStep, 
                //sim_time: simulationStore.simulationTime
            }

            //Execute a simulation iteration, based on whether there is a sim step or not
            sendMessage(socket, {action: 'sim', status: 'ok', data: payload})
            
            //Will be triggered again, whenever the frontend receives a new message
            simulationStore.continueSim = false
        }
    }
})


/**
 * Handle user request to pause the simulation
 * @param {*} cell 
 */
watch(()=> simulationStore.stopSim, (newVal, oldVal)=>{
    if(oldVal && !newVal) {
        simulationStore.continueSim = true
        simulationStore.stopSim = false
    }
})

/**
 * Handle user request to restart simulation
 */
watch(()=>simulationStore.rewindToStart, (newVal)=>{
    if(newVal) {
        //Fetch the model from the backend
        const modelName = simulationStore.getSelectedModelName
        getModel({name: modelName})
                .then((response) => {
                    simulationStore.resetAllButtons()
                    const modelJSON = JSON.parse(response)


                    simulationStore.setSimulationTime(0)
                    simulationStore.traceback = []
                    graph.fromJSON(modelJSON.model)
                })
                .catch((error)=>{
                    console.error("The following error occured, while fetching model: " + error)
                })
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

function findPlaceMarking() {
    const placeMarking = []
     
    for(const cell of graph.getCells()) {
        if(cell.attributes.type === 'custom.Place') {
            const label = cell.attributes.attrs.label.text
            const tokens = cell.attributes.attrs.tokenNumber.text
            placeMarking.push({label: label, tokenCount: tokens})
        }
    }

    console.log(placeMarking)
    return placeMarking
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
            response = JSON.parse(response)
            console.log(response)
            if(response.action == "model_created") {
                simulationStore.continueSim = true
            } else if(response.action=="visualize_fired_transition") {
                if(simulationStore.withTimeStep) {
                    console.log("With sim step")
                    simulationStore.simulationTime = simulationStore.getSimulationTime + simulationStore.simStep
                }
                else {
                    console.log("Without sim step")
                    console.log(response.delay)
                    
                    simulationStore.simulationTime = simulationStore.getSimulationTime + response.delay
                }
                
                transitionFiringAnimation(response.input_places, response.output_places, response.transition_id, graph, paper, simulationStore.simSpeed)
                    .then(()=>{
                        const placeMarking = findPlaceMarking()

                        const transition = findLabelsEnabledTransitions(response.transition_id)[0]
                        simulationStore.updateTraceback(transition, placeMarking)
                        
                        if(!simulationStore.stopSim && !simulationStore.rewindToStart)
                            simulationStore.continueSim = true
                        
                    })
    
            } else if(response.action == "end_sim") {
                console.log("End of the simulation")
            }
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