<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue'


import {useModelStore} from '@/components/stores/ModelStore'
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore'

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
            const modelName = args[0].name
            const params = {
                name: modelName
            }
        
            axios.get('/model', {params})
                    .then(function(response) {
                        simulationStore.resetAllActions()
                        const modelJSON = JSON.parse(response.data)

                        graph.fromJSON(modelJSON.model)
                        simulationStore.findEnabledTransitions()

                        const msg = createMsg("frontend", "backend", "instantiate_model", "", graph.toJSON())
                        
                        socket.send(msg)
                    })
                    .catch(function(err) {
                        console.log("An error occured" + err)
                    })
                    .finally(function() {
                                //
                    })

        } else if(name === "unselectModel") {
            //Backend notified to stop working with the model
            const msg = createMsg("frontend", "backend", "unselect_model", "", "")
            socket.send(msg)

            //Set all buttons of SimulationStore to their defaults, timer also resetted
            simulationStore.resetAllActions()
            graph.clear()

            simulationStore.resetTimer()
        } else if(name === "fireTransition") {
            const transitionId = args[0].id
            const modelJSON = graph.toJSON()
            
            
            const data = {
                model: modelJSON
            }

            const params = {
                name: simulationStore.getSelectedModelName, 
                transition_id: transitionId
            }

            axios.post('/model/fire-transition', {params, data})
                    .then((response) => {
                        fireTransitionAlternate(response.data.input_places, response.data.output_places, response.data.transition_id)
                                .then(()=> {
                                    simulationStore.findEnabledTransitions()
                                    simulationStore.firedTransition = true
                                })
                                .catch((err)=>{
                                    console.log("error is: " + err)
                                })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {
                        //
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

            axios.post('/model/enabled-transitions', {data,  params})
                    .then((response)=>{
                        const idsEnabledTransitions = response.data
                        
                        const enabledTransitions = findLabelsEnabledTransitions(idsEnabledTransitions)
                        simulationStore.setEnabledTransitions(enabledTransitions)
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                    .finally(()=>{
                        //
                    })
        }
    })
})


watch(()=> simulationStore.startSim, (newVal)=> {
    if(newVal) {
        simulationStore.startTimer()
        

        const msg = createMsg("frontend", "backend", "sim", "", graph.toJSON())
        
        socket.send(msg)
    }
    simulationStore.startSim = false
})



watch(() => simulationStore.stopSim, (newVal, oldVal) => {
    if(!newVal && oldVal) {
        simulationStore.resumeTimer()
        const continueSimMsg = createMsg("frontend", "backend", "sim", "", graph.toJSON())
        socket.send(continueSimMsg)
    }

    if(newVal) {
        simulationStore.stopTimer()
        const pauseMsg = createMsg("frontend", "backend", "pause_sim", "", "")
        socket.send(pauseMsg)
    }
})

watch(()=>simulationStore.rewindToStart, (newVal)=>{

})



//---------------------------------------------------
//Helper methods
//---------------------------------------------------

/**
 * Fire visually the transition on the graph, after the backend has returned the new markings
 * of input and output places
 * @param {*} inputPlaces {id, tokens} of all input places after the transition firing
 * @param {*} outputPlaces {id, tokens} of all output places after the transition firing
 * @param {*} transitionId Id of the transition, which has fired
 */
async function fireTransition( inputPlaces, outputPlaces, transitionId) {
    const inputPlacesViews = []
    inputPlaces.forEach((inputPlace)=>{
        const cell = graph.getCell(inputPlace.id)
        const cellView = paper.findViewByModel(cell)

        inputPlacesViews.push(cellView)
        cellView.highlight()
        cell.attr('tokenNumber/text', inputPlace.tokens)

        calcAvgTokens(cell)
        const oldInputPlaceCounter = cell.prop('inputPlaceCounter')
        cell.prop('inputPlaceCounter', oldInputPlaceCounter+1)
    })

    await sleep(500)
    inputPlacesViews.forEach((view) => view.unhighlight())

  
    transitionId.forEach((transition)=>{
        const cell = graph.getCell(transition)
        const cellView = paper.findViewByModel(cell)
        cellView.highlight()
    })
    

    await sleep(500)
    
    transitionId.forEach((transition)=>{
        const cell = graph.getCell(transition)
        const cellView = paper.findViewByModel(cell)
        cellView.unhighlight()
    })


    const outputPlacesViews = []
    outputPlaces.forEach((outputPlace) => {
        const cell = graph.getCell(outputPlace.id)
        const cellView = paper.findViewByModel(cell)

        outputPlacesViews.push(cellView)
        cellView.highlight()
        cell.attr('tokenNumber/text', outputPlace.tokens)

        calcAvgTokens(cell)
        const oldOutputPlaceCounter = cell.prop('outputPlaceCounter')
        cell.prop('outputPlaceCounter', oldOutputPlaceCounter+1)
    })
  
    await sleep(500)
    outputPlacesViews.forEach((view) => view.unhighlight())
}


async function fireTransitionAlternate(inputPlaces, outputPlaces, transitions) {
    inputPlaces.forEach((inputPlace)=>{
        const cell = graph.getCell(inputPlace.id)
        const cellView = paper.findViewByModel(cell)

      
        cellView.highlight()
        cell.attr('tokenNumber/text', inputPlace.tokens)

    })

    transitions.forEach((transition)=>{
        const cell = graph.getCell(transition)
        const cellView = paper.findViewByModel(cell)
        cellView.highlight()
    })
    
    outputPlaces.forEach((outputPlace) => {
        const cell = graph.getCell(outputPlace.id)
        const cellView = paper.findViewByModel(cell)
        cellView.highlight()
        cell.attr('tokenNumber/text', outputPlace.tokens)

    })    


    await sleep(1000)

    inputPlaces.forEach((inputPlace)=>{
        const cell = graph.getCell(inputPlace.id)
        const cellView = paper.findViewByModel(cell)
        cellView.unhighlight()
    })

  
    transitions.forEach((transition)=>{
        const cell = graph.getCell(transition)
        const cellView = paper.findViewByModel(cell)
        cellView.unhighlight()
    })
    
    outputPlaces.forEach((outputPlace) => {
        const cell = graph.getCell(outputPlace.id)
        const cellView = paper.findViewByModel(cell)
        cellView.unhighlight()
    }) 

    await sleep(500)
}


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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
            //Timer should be stopped
            simulationStore.stopTimer()
            
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