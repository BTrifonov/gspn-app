<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore'
import { watch, ref, onMounted, onUnmounted } from 'vue';

const simulationStore = useSimulationStore()


const simStep = ref(simulationStore.simStep)
const simSpeed = ref(simulationStore.simSpeed)

//Reset all buttons before unmounting the component
onUnmounted(()=>{
    simulationStore.resetAllButtons()
})

function handleStart() {
    simulationStore.startSim = true
}

function handleStop() {
    simulationStore.stopSim = !simulationStore.stopSim
}   


function handleRestart() {
    simulationStore.rewindToStart = !simulationStore.rewindToStart
}

/*function handleRewindToStart() {
    simMenuStore.rewindToStart()
}

function handleRewindToEnd() {
    simMenuStore.rewindToEnd()
}*/

watch(simStep, (newVal) => {
    simulationStore.simStep = newVal
})

watch(simSpeed, (newVal) => {
    simulationStore.simSpeed = parseFloat(newVal)
})

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
            <input type="number" placeholder="Simulation time step" class="input" min="0" v-model="simStep">
            <p> Simulation time step </p>
        </div>

        <div class="sim-container">
            <input type="range" min="0.5" max="2" step="0.5" class="input" v-model="simSpeed">
            <p>Simulation speed</p> 
        </div>

    </div>
</template>


<style scoped>
@import '@/assets/sidebar-submenu.css';

/*p {
    margin-top: 2px;
    margin-bottom: 2px;
}*/
</style>