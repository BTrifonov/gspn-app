<script setup>
import {ref, onMounted} from 'vue'


import {useModelStore} from '@/components/stores/ModelStore'


import * as joint from 'jointjs'
import axios from 'axios';

const plane = ref(null)

const modelStore = useModelStore()

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
                console.log(modelJSON)
                graph.fromJSON(modelJSON.model)  
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
            const model = args[0]
            const modelName = model.name

            const params = {
                name: modelName
            }

            axios.get('model/enabled-transitions', {params})
                .then(function(response) {
                    console.log(response)
                })
                .catch(function(error) {
                    console.log(error)
                })
                .finally(function() {
                    //
                })
        }
    })
})

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