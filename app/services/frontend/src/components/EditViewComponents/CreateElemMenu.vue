<script setup>
import { useTriggerStore } from '@/components/stores/TriggerStore';

const store = useTriggerStore()
//-------------------------------------------------------------
function triggerPlace() {
    store.placeTrigger = true
}

function triggerTransition() {
    store.transitionTrigger = true
}

function triggerImmediateTransition() {
    store.immediateTransitionTrigger = true
}

function triggerArc() {
    store.connectTrigger = !store.connectTrigger
}

</script>

<template>
    <div class="menu-container">
        <p class="text">Create Element</p>

        <div class="btn-container">
            <button @click="triggerPlace">
                <img src="../../assets/BasicElements/place.svg">
            </button> 
        
            <button @click="triggerTransition"> 
                <img src="../../assets/BasicElements/transition.svg">
            </button>
        
        
            <button @click="triggerImmediateTransition"> 
                <img src="../../assets/BasicElements/immediateTransition.svg">
            </button>
        
            <button @click="triggerArc">
                <img src="../../assets/MenuIcons/arrow-right.png">
            </button> 
        </div>
    </div>
</template>


<style scoped>
@import '@/assets/sidebar-submenu.css';
</style>