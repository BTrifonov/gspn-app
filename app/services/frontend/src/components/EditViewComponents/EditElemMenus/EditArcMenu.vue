<script setup>
import { useElementStore } from '@/components/stores/EditElementStore.js';
import { ref } from 'vue';

const editElementStore = useElementStore()
const arcWeight = ref(editElementStore.getArcWeight)

/**
 * Handle user request to delete an arc
 */
function deleteArc() {
    editElementStore.deleteArc()
}

/**
 * Handle user request to change the weight of an arc 
 * @param {*} event DOM Input element
 */
function handleArcWeightInput(event) {
    const input = arcWeight.value
    const inputInteger = parseInt(input)

    if(isNaN(inputInteger)) {
        alert("Arc weight should be an integer")
        event.target.blur()
        return
    }

    if(inputInteger <= 0) {
        alert("Arc weight should be positive")
        event.target.blur()
        return
    }

    editElementStore.setArcWeight(inputInteger)
    event.target.blur()
}

</script>

<template>
    <div>
        <div class="sim-container">
            <input type="number" v-model="arcWeight" class="input" @keydown.enter="handleArcWeightInput">
            <p>Change arc weight</p>
        </div>
        <div class="btn-container">
            <button @click="deleteArc">
                <img src="@/assets/EditPlaneButtons/delete.svg">
            </button>
        </div>
    </div>
</template>

<style>
@import '@/assets/sidebar-submenu.css';

</style>