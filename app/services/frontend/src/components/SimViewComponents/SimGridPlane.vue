<script setup>
import {ref, onMounted} from 'vue'


import {useModelStore} from '@/components/stores/ModelStore'


import { useEnabledTransitionsStore } from '@/components/stores/SimViewStores/EnabledTransitionsStore'


import * as joint from 'jointjs'
import axios from 'axios';

const plane = ref(null)

const modelStore = useModelStore()
const enabledTransitionsStore = useEnabledTransitionsStore()

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


    modelStore.unselectAllModels()
})

//---------------------------------------------
//
//---------------------------------------------
//User interaction with the SimModelMenu
modelStore.$onAction(({
    name, 
    store, 
    args, 
    after, 
    onError
}) => {
    after((result)=> {
        if(name === "selectModel") {
        //fetch the model and return to the frontend
        const model = args[0]

        //Fetch the model based on the model.name
        const params = {
            name: model.name
        }


        axios.get('/model', {params})
            .then(function(response) {
                console.log("Fetch the model with name: " + model.name)
       
                const modelJSON = JSON.parse(response.data)
                graph.fromJSON(modelJSON.model)
                
                //find enabled transitions
                enabledTransitionsStore.selectModel(model.name)
                enabledTransitionsStore.findEnabledTransitions()

            })
            .catch(function(err) {
                console.log("An error occured" + err)
            })
            .finally(function() {
                //
            })
        } else if(name === "unselectModel") {
            graph.clear()
        } else if(name == "simulateModel") {
            //
        }
    })
})

enabledTransitionsStore.$onAction(({
    name, 
    store,
    args, 
    after, 
    onError
}) => {
    after((res) => {
        if(name === "findEnabledTransitions") {
            const modelName = enabledTransitionsStore.getModelName

            const params = {
                name: modelName
            }

            axios.get('model/enabled-transitions', {params})
                .then(function(response) {
                    //highlightEnabledTransitions(response.data)

                    const enabledTransitions = setEnabledTransitions(response.data)

                    enabledTransitionsStore.setEnabledTransitions(enabledTransitions)
                })
                .catch(function(error) {
                    console.log(error)
                })
                .finally(function() {
                    //
                })
        } else if(name === "fireTransition") {
            const modelName = enabledTransitionsStore.getModelName
            const transition = args[0]
            console.log("Fire transition with label: " + transition.label)
            console.log("Transition id is: " + transition.id)

            const params = {
                name: modelName, 
                transition_id: transition.id
            }

            axios.post('/model/fire-transition', {params})
                    .then(function(response) {
                        console.log(response.data)
                        animateSimulation(response.data.input_places, response.data.output_places, transition.id)
                    })
        }
    })
})


function animateSimulation(inputPlaces, outputPlaces, transitionId) {
    for(const inputPlace of inputPlaces) {
        const cell = graph.getCell(inputPlace.id)
        const cellView = paper.findViewByModel(cell)

        setTimeout(()=>{
            highlightUnhighlightElement(inputPlace.tokens, cell, cellView)
        }, 1000)
    }

    /*const cell = graph.getCell(transitionId)
    const cellView = paper.findViewByModel(cell)
    cellView.highlight()
    */
    

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

function highlightEnabledTransitions(idTransitions) {
    for(let i = 0; i < idTransitions.length;i++) {
        const cell = graph.getCell(idTransitions[i])
        const cellView = paper.findViewByModel(cell)
        cellView.highlight()
    }
}

function setEnabledTransitions(idTransitions) {
    const enabledTransitions = []
    for(let i = 0;i < idTransitions.length;i++) {
        const cell = graph.getCell(idTransitions[i])
        const label = cell.attr('label/text')
        enabledTransitions.push({id: idTransitions[i], label: label})
    }
    return enabledTransitions
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