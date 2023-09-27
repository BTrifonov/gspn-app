<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore.js'

const simulationStore = useSimulationStore()

</script>

<template>
    <div class="menu-container">
        <p class="text">Fire Transition</p>
        <div v-for="transition in simulationStore.enabledTransitions" class="sim-container">
            <a  href="#"
                class="a-container"
                @click="simulationStore.fireTransition(transition)">
                {{ transition.label }}
            </a>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';

.a-container {
    display: block;
    height: 100%;
    width: 100%;
    text-decoration: none;
}

</style>