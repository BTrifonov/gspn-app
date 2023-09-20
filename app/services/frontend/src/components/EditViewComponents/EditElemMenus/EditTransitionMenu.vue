<script setup>
import { useElementStore } from '@/components/stores/EditElementStore';
import { ref, watch } from 'vue';

const editElementStore = useElementStore()


//Values retrieved from the editElementStore
const label = ref(editElementStore.getTransitionLabel)

//TODO: The chosen option should be displayed as well
const distribution = ref(editElementStore.getTransitionDistribution)


const rate = ref(editElementStore.getTransitionDistributionRate)


function deleteTransition() {
    editElementStore.deleteTransition()
}

//Update the transition values, if a new transition is selected, before a previous one is unselected
watch(()=> editElementStore.selectedElement, (newVal)=>{
    if(newVal!=null) {
        label.value = editElementStore.getTransitionLabel
        distribution.value = editElementStore.getTransitionDistribution
        rate.value = editElementStore.getTransitionDistributionRate
    }
})

watch(label, (newValue) => {
    editElementStore.setTransitionLabel(newValue)
})

watch(distribution, (newValue)=> {
    editElementStore.setTransitionDistribution(newValue)
})

watch(rate, (newValue)=>{
    editElementStore.setTransitionRate(newValue)
})
</script>

<template>
    <div>
        <div class="sim-container">
            <input type="text"  v-model="label" class="input">
            <p>Change transition label</p>
        </div>

        <div class="sim-container">
            <select v-model="distribution" placeholder="{{ distribution }}" class="input">
                <option value="">Exponential</option>
                <option value="">General</option>
            </select>
            <p>Change transition token distribution</p>
        </div>

        <div class="sim-container">
            <input type="number" v-model="rate" class="input">
            <p>Change token distribution rate</p>
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
</style>