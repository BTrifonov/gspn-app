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
})


modelStore.$onAction(({
    name, 
    store, 
    args, 
    after, 
    onError
}) => {

   
    after((result)=> {
        if(name === "selectModel") {
           console.log(result)
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