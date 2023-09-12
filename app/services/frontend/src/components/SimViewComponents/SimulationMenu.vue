<script setup>
import {useSimMenuStore} from '@/components/stores/SimViewStores/SimMenuStore'
import { watch, ref } from 'vue';

const simMenuStore = useSimMenuStore()
const simSpeed = ref(0)

function handleStart() {
    simMenuStore.startButton()
}

function handleStop() {
    simMenuStore.stop()
}   

function handleRewindToStart() {
    simMenuStore.rewindToStart()
}

function handleRewindToEnd() {
    simMenuStore.rewindToEnd()
}

watch(simSpeed, (newVal) => {
    simMenuStore.setSimSpeed()
})


</script>

<template>
    <div class="menu-container">
        <p class="text"> Execute Simulation </p>

        <div class="btn-container">
            <button @click="handleStart">
                <img src="../../assets/SimButtons/startButton.svg">
            </button>

            <button @click="handleStop">
                <img src="../../assets/SimButtons/stopButton.svg">
            </button>

            <button>
                <img src="../../assets/SimButtons/restartButton.svg">
            </button>

            <button @click="handleRewindToStart">
                <img src="../../assets/SimButtons/skipToStartButton.svg">
            </button>

            <button @click="handleRewindToEnd">
                <img src="../../assets/SimButtons/skipToEndButton.svg">
            </button>
        </div>

        <div class="sim-container">
            <input type="range" min="0.5" max="2" step="0.5" class="input" v-model="simSpeed">
            <p>Simulation speed</p> 
        </div>
    </div>
</template>



<style scoped>
@import '@/assets/sidebar-submenu.css';
</style>