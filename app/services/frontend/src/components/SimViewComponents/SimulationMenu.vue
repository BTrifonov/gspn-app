<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore'
import { watch, ref } from 'vue';

const simulationStore = useSimulationStore()
const simSpeed = ref(0)

function handleStart() {
    simulationStore.startSim = true
}

function handleStop() {
    simulationStore.stopSim = !simulationStore.stopSim
}   

/*
function handleRewindToStart() {
    simMenuStore.rewindToStart()
}

function handleRewindToEnd() {
    simMenuStore.rewindToEnd()
}

watch(simSpeed, (newVal) => {
    simMenuStore.setSimSpeed()
})
*/

</script>

<template>
    <div class="menu-container">
        <p class="text"> Execute Simulation </p>

        <div class="btn-container">
            <button @click="handleStart">
                <img src="../../assets/SimButtons/startButton.svg">
            </button>

            <button @click="handleStop">
                <img src="../../assets/SimButtons/stopButton.svg">
            </button>

            <button>
                <img src="../../assets/SimButtons/restartButton.svg">
            </button>

            <button @click="handleRewindToStart">
                <img src="../../assets/SimButtons/skipToStartButton.svg">
            </button>

            <button @click="handleRewindToEnd">
                <img src="../../assets/SimButtons/skipToEndButton.svg">
            </button>
        </div>

        <div class="sim-container">
            <input type="range" min="0.5" max="2" step="0.5" class="input" v-model="simSpeed">
            <p>Simulation speed</p> 
        </div>
    </div>
</template>



<style scoped>
@import '@/assets/sidebar-submenu.css';
</style>