<script setup>
import AutoSimMenu from '@/components/SimViewComponents/AutoSimMenu.vue';
import ManualSimMenu from '@/components/SimViewComponents/ManualSimMenu.vue';

import SimTracebackMenu from '@/components/SimViewComponents/SimTracebackMenu.vue';
import ModelMenu from '@/components/SimViewComponents/ModelMenu.vue';
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
            <ModelMenu/>
        </div>
        <div>
            <SimModeMenu/>
        </div>
        <!--<div v-if="simulationStore.enteredSimStep || simulationStore.withoutTimeStep">
            <AutoSimMenu/>
        </div>
        <div v-if="simulationStore.manualSimulation">
            <ManualSimMenu/>
        </div>-->
        <div>
            <SimElapsedTimeMenu/>
        </div>
        <!--<div>
            <SimPlaceStatMenu/>
        </div>-->
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