<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore.js'

const simulationStore = useSimulationStore()

function handleModelSelection(model) {
    if(!model.selected) {
        //model.selected is false -> user selects model
        simulationStore.selectModel(model)
    }
    else {
        //model.selected is true -> user unselects model
        simulationStore.unselectModel(model)
    }
}
</script>

<template>
    <div class="menu-container">
        <p class="text"> Choose model </p>
        
        <div>
            <div v-for="model in simulationStore.getModels" class="sim-container">
                    <a  href="#" 
                        class="a-container" 
                        :style="{ color: model.selected ? 'white' : 'blue' }"
                        @click="handleModelSelection(model)">
                    
                        {{ model.name }}
                    
                    </a>
            </div>
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