<script setup>
import { useElementStore } from '@/components/stores/EditElementStore';
import { ref, watch } from 'vue';

const editElementStore = useElementStore()

const label = ref('')
const distribution = ref(null)
const rate = ref(null)

function deleteTransition() {
    editElementStore.unselectAll()
    editElementStore.deleteTransition()
}

watch(label, (newValue) => {
    editElementStore.setTransitionLabel(newValue)
})

watch(distribution, (newValue)=> {
    editElementStore.setTransitionDistribution(newValue)
})

watch(rate, (newValue)=>{
    console.log("New distribution rate should be set: " + newValue)
    editElementStore.setTransitionRate(newValue)
})
</script>

<template>
    <div>
        <div class="sim-container">
            <input type="text" placeholder="Transition label" v-model="label" class="input">
            <p>Change transition label</p>
        </div>

        <div class="sim-container">
            <select v-model="distribution" class="input">
                <option value="">Exponential</option>
                <option value="">General</option>
            </select>
            <p>Change transition token distribution</p>
        </div>

        <div class="sim-container">
            <input type="number" placeholder="Distribution rate" v-model="rate" class="input">
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