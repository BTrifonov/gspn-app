<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore'
import { watch, ref, onMounted } from 'vue';

const simulationStore = useSimulationStore()
const simSpeed = ref(0)


onMounted(()=>{
    simulationStore.resetAllActions()
})

function handleStart() {
    simulationStore.startSim = true
}

function handleStop() {
    /*if(!simulationStore.stopSim) {
        if(!simulationStore.startSim) {
            console.log("Cannot stop unplayed simulation!")
            return
        } else {
            simulationStore.stopSim = true
        }
    } 8else {
        simulationStore.stopSim = false
    }*/
    simulationStore.stopSim = !simulationStore.stopSim
}   


function handleRestart() {
    simulationStore.rewindToStart = !simulationStore.rewindToStart
}

/*function handleRewindToStart() {
    simMenuStore.rewindToStart()
}*/

/*
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

            <button 
                @click="handleStop" 
                :style="{'background-color': simulationStore.stopSim ? 'grey' : 'silver'}">

                <img src="../../assets/SimButtons/stopButton.svg">
            </button>

            <button @click="handleRestart">
                <img src="../../assets/SimButtons/restartButton.svg">
            </button>

            <!--<button @click="handleRewindToStart">
                <img src="../../assets/SimButtons/skipToStartButton.svg">
            </button>-->

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