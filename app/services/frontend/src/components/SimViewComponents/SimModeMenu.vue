<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore'
import {ref, watch} from 'vue'

const simulationStore = useSimulationStore()
const simStep = ref(simulationStore.simStep)
const simStepMenuEnabled = ref(true)

function triggerManualSim() {
    simulationStore.setManualSimulation()
}

function triggerAutomaticSim() {
    simulationStore.setAutomaticSimulation()
    simStepMenuEnabled.value = true

    //Wait for the user to choose sim step
    simulationStore.enteredSimStep = false
}

function handleSimStepInput() {
    simulationStore.simStep = simStep.value
    
    //Sim step remains the same for the whole simulation
    simStepMenuEnabled.value = false

    //Now simulation can start, show to user the other buttons
    simulationStore.enteredSimStep = true
}
</script>

<template>
    <div class="menu-container">
        <p class="text">Choose simulation mode</p>

        <div class="btn-container">
            <button
                :style="{ 'pointer-events': simulationStore.isModelSelected ? 'auto' : 'none',
                            'background-color': simulationStore.automaticSimulation ? 'grey' : 'silver',
                                opacity: simulationStore.isModelSelected ? 1 : 0.4 }" 
                @click="triggerAutomaticSim">
                Automatic
            </button>

            <button
                :style="{ 'pointer-events': simulationStore.isModelSelected ? 'auto' : 'none',
                            'background-color': simulationStore.manualSimulation ? 'grey' : 'silver',
                                opacity: simulationStore.isModelSelected ? 1 : 0.4 }"
                @click="triggerManualSim"
                >

                Manual
            </button>
        </div>

        <div  v-if="simulationStore.automaticSimulation" class="btn-container">
            <button @click="simulationStore.handleWithoutTimeStepSim" 
                    :style="{'background-color': simulationStore.withoutTimeStep ? 'grey': 'silver'}"> 
                Without user time step
            </button>
            <button @click="simulationStore.handleWithTimeStepSim"
                    :style="{'background-color': simulationStore.withTimeStep ? 'grey' : 'silver'}">
                With user time step
            </button>
            
        </div>


        <div v-if="simulationStore.withTimeStep" class="sim-container">
            <input v-if="simStepMenuEnabled" type="number" class="input" min="0" v-model="simStep" @keydown.enter="handleSimStepInput">
            <input v-else type="number" v-model="simStep" disabled>
            <p> Simulation time step </p>
        </div>
    </div>

</template>


<style scoped>
@import '@/assets/sidebar-submenu.css';

.btn-container {
    justify-content: space-evenly;
}

</style>