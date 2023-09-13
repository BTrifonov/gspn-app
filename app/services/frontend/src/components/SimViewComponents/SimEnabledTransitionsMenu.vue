<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore'
import { ref, watch } from 'vue';

const simulationStore = useSimulationStore()

const enabledTransitions = ref(null)

watch(()=> simulationStore.firedTransition, (newVal) => {
    if(newVal) {
        enabledTransitions.value = simulationStore.getEnabledTransitions
    }
    simulationStore.firedTransition = false
})

watch(()=>simulationStore.enabledTransitions, (newVal) => {
    console.log("Setting new enabled transitions:") 
    console.log(simulationStore.enabledTransitions)
    enabledTransitions.value = newVal
})

function fireTransition(transition) {
    simulationStore.fireTransition(transition)
    simulationStore.findEnabledTransitions()

}

</script>

<template>
    <div class="menu-container">
        <p class="text">Enabled Transitions</p>
        <div v-for="transition in enabledTransitions" class="sim-container">
            <a  href="#"
                class="a-container"
                @click="fireTransition(transition)">
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

/*
.tr-container {
    width: 90%;
    margin: 5%;
    background-color: rgb(9, 147, 240);
    border-radius: 5px;
}*/
</style>