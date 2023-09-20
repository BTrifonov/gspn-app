<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue'


import {useModelStore} from '@/components/stores/ModelStore'
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore'


import {getModel, fireTransition, findEnabledTransitions} from '@/components/SimViewComponents/requests.js'
import {transitionFiringAnimationAlternate, transitionFiringAnimation} from '@/components/SimViewComponents/simAnimation.js'

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

//Socket should be opened only when a connection

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


    //TODO: Socket communication should be initiated only for auto simulation!
    //Instantiate the socket
    socket = new WebSocket("ws://localhost:5000/ws/123")

    //Handle websocket incoming messages
    socket.onmessage = function(event) {
        handleIncomingMsg(event)
    }
})

onUnmounted(()=>{
    //Close the websocket connection
    socket.close()

    //Unselect all models from the menu
    simulationStore.unselectAllModels()
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
            //Fetch the model based on the model.name
            const model = args[0]
            
            getModel({name: model.name})
                .then((response) => {
                    simulationStore.resetAllActions()
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
            //Backend notified to stop working with the model
            //const msg = createMsg("frontend", "backend", "unselect_model", "", "")
            //socket.send(msg)

            simulationStore.resetAllActions()
            simulationStore.setSimulationTime(0)

            graph.clear()
        } else if(name === "fireTransition") {
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

                    console.log(transitions)
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

        //Improve the code to ensure that findEnabledTransitions is always working with the most recent graph            
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


watch(()=> simulationStore.startSim, (newVal)=> {
    if(newVal) {
        const msg = createMsg("frontend", "backend", "sim", "", graph.toJSON())
        
        socket.send(msg)
    }
    simulationStore.startSim = false
})



watch(() => simulationStore.stopSim, (newVal, oldVal) => {
    if(!newVal && oldVal) {
        const continueSimMsg = createMsg("frontend", "backend", "sim", "", graph.toJSON())
        socket.send(continueSimMsg)
    }

    if(newVal) {
        const pauseMsg = createMsg("frontend", "backend", "pause_sim", "", "")
        socket.send(pauseMsg)
    }
})

watch(()=>simulationStore.rewindToStart, (newVal)=>{

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

function handleIncomingMsg(event) {
    const msgJSON = event.data
    const msg = JSON.parse(msgJSON)

    switch (msg.action) {
        case "visualize_fired_transition": {
            fireTransitionAlternate(msg.input_places, msg.output_places, msg.transition_id)
                .then((response) => {
                    const continueSimMsg = createMsg("frontend", "backend", "sim", "", graph.toJSON())
                    if(!simulationStore.stopSim)
                        socket.send(continueSimMsg)
                })
                .catch((err) => {
                    const msg = createMsg("frontend", "backend", "response", "fail", "")
                    console.log(err)
                })
            break
        }
        case "end_sim": {
            console.log("End of the simulation reached")
            break
        }
        default: {
            const msgJSON = event.data
            const msg = JSON.parse(msgJSON)
            
            console.log(msg)
        }
    }
}

/**
 * Set the flags of the transmitted msg, based on user input
 */
function setFlags() {
    const flags = []
    if(simulationStore.stopSim) {
        //user requested to stop the simulation
        flags.push({"stop": true})
    } else {
        flags.push({"stop": false})
    }
    
    flags.push({"replay": true})
    return flags
}

function createMsg(senderData, receiverData, actionData, statusData, contentData) {
    const msg = JSON.stringify({
        sender: senderData, 
        receiver: receiverData, 
        action: actionData,
        status: statusData,
        data: contentData,
        flags: setFlags()
    })

    console.log
    return msg
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