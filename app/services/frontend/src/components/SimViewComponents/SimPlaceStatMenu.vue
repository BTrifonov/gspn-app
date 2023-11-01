<script setup>
import {useSimulationStore} from '@/components/stores/SimViewStores/SimulationStore.js'
import { ref, watch} from 'vue';

const simulationStore = useSimulationStore()


const isPlaceSelected = ref(false)
const inputPlaceCounter = ref(0)
const outputPlaceCounter = ref(0)
const avgTokens = ref(0)

watch(()=> simulationStore.isPlaceSelected, (newVal)=>{
    //update the local variable
    isPlaceSelected.value = newVal

    if(newVal) {
        inputPlaceCounter.value = simulationStore. getInputPlaceCount
        outputPlaceCounter.value = simulationStore. getOutputPlaceCount
        avgTokens.value = simulationStore.getAvgTokenPlace
    }

})

</script>


<template>
    <div class="menu-container">
        <p class="text">See place stats</p>

        <div v-if="isPlaceSelected">
            <!--<div class="sim-container">
                <p> {{ inputPlaceCounter }}</p>
                <p> Times as input place</p>
            </div>
            <div class="sim-container">
                <p> {{ outputPlaceCounter }}</p>
                <p> Times as output place</p>
            </div>-->
            <div class="sim-container">
                <p> {{ avgTokens }}</p>
                <p> Average token number</p>
            </div>
        </div>
        <div v-else>
            <div class="sim-container">
               <p>
                Click once on a place
               </p>
            </div>
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