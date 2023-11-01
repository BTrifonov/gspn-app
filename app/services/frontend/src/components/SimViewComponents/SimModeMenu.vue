<script setup>
import ManualSimMenu from '@/components/SimViewComponents/ManualSimMenu.vue';
import AutoSimMenu from '@/components/SimViewComponents/AutoSimMenu.vue';

import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore.js'

const simulationStore = useSimulationStore()

function triggerManualSim() {
    simulationStore.setManualSimulation()
}

function triggerAutomaticSim() {
    simulationStore.setAutomaticSimulation()
}

</script>

<template>
    <div>
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
                    @click="triggerManualSim">
                    Manual
                </button>
            </div>
        </div>

        <div v-if="simulationStore.manualSimulation">
            <ManualSimMenu/>
        </div>

        <div v-if="simulationStore.automaticSimulation">
            <AutoSimMenu/>
        </div>
    </div>
</template>


<style scoped>
@import '@/assets/sidebar-submenu.css';

.btn-container {
    justify-content: space-evenly;
}

</style>