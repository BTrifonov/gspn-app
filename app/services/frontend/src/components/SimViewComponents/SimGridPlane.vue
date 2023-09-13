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

let socket = new WebSocket("ws://localhost:5000/ws/123")

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
})

onUnmounted(()=>{
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
        
            return axios.get('/model', {params})
                            .then(function(response) {
                                console.log("Fetch the model with name: " + model.name)
                                const modelJSON = JSON.parse(response.data)

                                graph.fromJSON(modelJSON.model)
                                simulationStore.findEnabledTransitions()
                            })
                            .catch(function(err) {
                                console.log("An error occured" + err)
                            })
                            .finally(function() {
                                //
                            })


            //graph.fromJSON(result)

        } else if(name === "unselectModel") {
            graph.clear()
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
                        fireTransition(response.data.input_places, response.data.output_places, transitionId)
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
        const data = JSON.stringify({
            action: "startSim", 
            model: graph.toJSON()
        })
       
        socket.send(data)

        //const buff = []
        socket.onmessage = function(event) {
            const responseJSON = event.data
            const responseObj = JSON.parse(responseJSON)
            
            console.log("Following data received from server:")
            console.log(responseObj.input_places)
            console.log(responseObj.output_places)
            console.log(responseObj.transition_id)

            fireTransition(responseObj.input_places, responseObj.output_places, responseObj.transition_id)
                        .then((response)=>{
                            //successful visual firing of a transition
                            //inform the backend
                            const confirmData = JSON.stringify({
                                response: "success",
                                action: "resp"
                            })
                            
                            socket.send(confirmData)
                            
                        })
                        .catch((err)=>{
                            const confirmData = JSON.stringify({
                                response: "failure",
                                action: "resp"
                            })

                            socket.send(confirmData)
                        })
        }
        simulationStore.startSim = false
    }   
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
    })

    await sleep(500)
    inputPlacesViews.forEach((view) => view.unhighlight())

  
    const cell = graph.getCell(transitionId)
    const cellView = paper.findViewByModel(cell)
    cellView.highlight()

    await sleep(500)
    
    cellView.unhighlight()

    const outputPlacesViews = []
    outputPlaces.forEach((outputPlace) => {
        const cell = graph.getCell(outputPlace.id)
        const cellView = paper.findViewByModel(cell)

        outputPlacesViews.push(cellView)
        cellView.highlight()
        cell.attr('tokenNumber/text', outputPlace.tokens)
    })
  
    await sleep(500)
    outputPlacesViews.forEach((view) => view.unhighlight())
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