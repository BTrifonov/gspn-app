<script setup>
import SimAutoMenu from '@/components/SimViewComponents/SimAutoMenu.vue';
import SimManualMenu from '@/components/SimViewComponents/SimManualMenu.vue';

import SimTracebackMenu from '@/components/SimViewComponents/SimTracebackMenu.vue';
import SimModelMenu from '@/components/SimViewComponents/SimModelMenu.vue';
import SimPlaceStatMenu from '@/components/SimViewComponents/SimPlaceStatMenu.vue';

import SimModeMenu from '@/components/SimViewComponents/SimModeMenu.vue';

import ChangeViewMenu from '@/components/ChangeViewMenu.vue';
import SimElapsedTimeMenu from '@/components/SimViewComponents/SimElapsedTimeMenu.vue';

import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore.js'

const simulationStore = useSimulationStore()

</script>
<template>
    <div class="container">
        <div>
            <SimModelMenu/>
        </div>
        <div>
            <SimModeMenu/>
        </div>
        <div v-if="simulationStore.enteredSimStep || simulationStore.withoutTimeStep">
            <SimAutoMenu/>
        </div>
        <div v-if="simulationStore.manualSimulation">
            <SimManualMenu/>
        </div>
        <div>
            <SimElapsedTimeMenu/>
        </div>
        <div>
            <SimPlaceStatMenu/>
        </div>
        <div>
            <SimTracebackMenu/>
        </div>
        <div>
            <ChangeViewMenu/>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-structure.css';


</style>