<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore.js'
import { ref, watch } from 'vue';

const simulationStore = useSimulationStore()

const traceback = ref(simulationStore.getTraceback)

watch(()=>simulationStore.getTraceback, (newVal)=> {
    traceback.value = newVal
})

function truncateTime(time) {
    //up to 3th decimal precision
    const t = time * Math.pow(10, 3)
    const truncTimeInteger = Math.trunc(t)
    const timeTruncated = truncTimeInteger / 1000.0
    return timeTruncated
}

function constructMarkingArray(trace) {
    const result=""
    const start="["
    const end="]"

    const placeMarking = trace.places.map(place => `${place.label}=${place.tokenCount}`).join(', ')
    
    return result.concat(start, placeMarking, end)
}
</script>

<template>
    <div class="menu-container">
        <p class="text">Path traceback</p>
        <div class="traceback-container">
            <div class="time-container">
                Time
            </div>
            <div class="place-marking-container">
                Marking
            </div>
            <div class="fired-transition-container">
                T
            </div>
        </div>
        <div v-for="trace in traceback" class="traceback-container">
            <div class="time-container">
                {{ truncateTime(trace.time) }}
            </div>
            <div class="place-marking-container">
                {{ constructMarkingArray(trace) }}
            </div>
            <div class="fired-transition-container">
                {{ trace.transition_label }}
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';


/**TODO: Styling here could be significantly improved */
.traceback-container {
    display: flex;
    flex-direction: row;
    width: auto;

    overflow: auto;
    justify-content: space-between;

    border-radius: 5px;
    margin-bottom: 2px;
}

.time-container {
    display: flex;
    width: 20%;
    background-color:  rgb(9, 147, 240);
    border-radius: 5px;
}

.place-marking-container {
    display: flex;
    width: 60%;
    background-color:  rgb(9, 147, 240);
    border-radius: 5px;
    white-space:nowrap;
    overflow:auto;
}

.fired-transition-container {
    display: flex;
    width: 10%;
    background-color:  rgb(9, 147, 240);
    border-radius: 5px;
}
</style>