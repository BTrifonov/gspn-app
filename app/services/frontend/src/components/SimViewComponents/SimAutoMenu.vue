<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore.js'
import { watch, ref, onUnmounted } from 'vue';

const simulationStore = useSimulationStore()


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


function handleRewindToEnd() {
    simMenuStore.rewindToEnd()
}

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

/*p {
    margin-top: 2px;
    margin-bottom: 2px;
}*/
</style>