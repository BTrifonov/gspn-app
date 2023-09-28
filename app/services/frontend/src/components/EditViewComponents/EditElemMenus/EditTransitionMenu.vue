<script setup>
import { useElementStore } from '@/components/stores/EditElementStore.js';
import { ref, watch } from 'vue';

const editElementStore = useElementStore()

const label = ref(editElementStore.getTransitionLabel)
const distribution = ref(editElementStore.getTransitionDistribution)
const rate = ref(editElementStore.getTransitionDistributionRate)

const isImmediateTransition = ref(editElementStore.getTransitionIsTimed)

/**
 * Update local variables, if the user selects a new transition, before
 * unselecting the previous one
 */
watch(()=> editElementStore.selectedElement, (newVal)=>{
    if(newVal!=null) {
        label.value = editElementStore.getTransitionLabel
        distribution.value = editElementStore.getTransitionDistribution
        rate.value = editElementStore.getTransitionDistributionRate
    }
})

/**
 * Handle user request to enter transition label
 * 
 */
function handleTransitionLabelInput(event) {
    //TODO: Here a simple input validation is required, e.g only letters and numbers should be allowed
    editElementStore.setTransitionLabel(label.value)
    event.target.blur()
}

/**
 * Handle user request to enter transition distribution type
 * 
 */
function handleTransitionDistributionInput() {
    editElementStore.setTransitionDistribution(distribution.value)
}

/**
 * Handle user request to enter transition firing rate
 * 
 */
function handleTransitionRateInput(event) {
    const input = rate.value
    const inputFloat = parseFloat(input)

    if (isNaN(inputFloat)) {
        alert("The firing rate should be a number")
        rate.value = editElementStore.getTransitionDistributionRate
        event.target.blur()
        return
    } 
    
    if(inputFloat <= 0) {
            alert("The firing rate should be higher than 0")
            rate.value = editElementStore.getTransitionDistributionRate
            event.target.blur()
            return
        }
    
    editElementStore.setTransitionRate(rate.value)
    event.target.blur()
}

/**
 * Handle user request to delete a transition
 */
 function deleteTransition() {
    editElementStore.deleteTransition()
}
</script>

<template>
    <div>
        <div class="sim-container">
            <input type="text"  v-model="label" class="input" @keydown.enter="handleTransitionLabelInput">
            <p>Change transition label</p>
        </div>

        <div class="sim-container">
            <select v-model="distribution" class="input" @change="handleTransitionDistributionInput" :disabled="!isImmediateTransition">
                <option>Exponential</option>
                <option>General</option>
            </select>
            <p>Change transition token distribution</p>
        </div>

        <div class="sim-container">
            <div class="firing-rate-input-container">
                <div class="lambda-text-container">
                    &lambda; =
                </div>
                
                <input type="number" v-model="rate" class="input" @keydown.enter="handleTransitionRateInput" :disabled="!isImmediateTransition">
            </div>
            <div>
                <p> Change transition firing rate</p>
            </div>
        </div>

        <div class="btn-container">
            <button @click="deleteTransition">
                <img src="@/assets/EditPlaneButtons/delete.svg">
            </button>
        </div>

    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';
.btn-container {
    justify-content: center;
}

.lambda-text-container {
    width: 20%;
    margin-top: 4px;
    text-align: center;
}

.firing-rate-input-container {
    margin-top: 2px;
    display: flex;
    flex-direction: row;
    width: 100%;
}
</style>