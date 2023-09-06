<script setup>
import {ref, onMounted} from 'vue'


import * as joint from 'jointjs'
import axios from 'axios';


const plane = ref(null)

const namespace = joint.shapes

const graph = new joint.dia.Graph({}, {cellNamespace:namespace})

let paper = null
onMounted(()=> {
    //fetch the locally saved model
      axios.get('/model/plainJSON')
            .then(function(response) {
                console.log("Success")
                graph.fromJSON(JSON.parse(response.data))
            })
            .catch(function(response) {
                console.log("Error occured")
                console.log("Error is: ")
                console.log(response)
            })
            .finally(function(response) {
                
            })


    paper = new joint.dia.Paper({
        el: plane.value, 
        model: graph, 
        height: '100%', 
        width: '100%',
        drawGrid: 'mesh',
        gridSize: 5,
        cellViewNamespace: namespace,
    })

})

</script>


<template>
    <div class="plane-container" ref="container" :style="styleContainer">
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