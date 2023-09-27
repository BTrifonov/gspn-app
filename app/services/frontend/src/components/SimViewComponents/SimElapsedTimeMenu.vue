<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore.js'
import { ref, watch } from 'vue';

const simulationStore = useSimulationStore()

const time = ref(simulationStore.getSimulationTime)

watch(() => simulationStore.getSimulationTime, (newVal) => {
    time.value = newVal
})

</script>

<template>
    <div class="menu-container">
        <p class="text">Elapsed time</p>

        <div class="sim-container">
            <p>{{ time }}</p>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';

p {
    margin-top: 2px;
    margin-bottom: 2px;
}
</style>