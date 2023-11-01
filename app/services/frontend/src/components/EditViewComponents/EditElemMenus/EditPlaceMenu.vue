<script setup>
import { useElementStore } from '@/components/stores/EditElementStore.js';
import { onMounted, watch } from 'vue';
import { ref } from 'vue';




const editElementStore = useElementStore()

const label = ref(editElementStore.getPlaceLabel)
const tokenNumber = ref(editElementStore.getPlaceTokens)



/**
 * Update local variables, if the user selects a new place, before
 * unselecting the previous one
 */
watch(() => editElementStore.selectedElement, (newVal)=>{
    if(newVal!=null){
        label.value = editElementStore.getPlaceLabel
        tokenNumber.value = editElementStore.getPlaceTokens
    }
})

/**
 * Handle user request to enter place label
 * 
 */
function handlePlaceLabelInput(event) {
    //TODO: Here a simple input validation is required, e.g only letters and numbers should be allowed
    editElementStore.setPlaceLabel(label.value)
    event.target.blur()
}

/**
 * Handle user request to enter place tokens
 */
function handlePlaceTokenInput(event) {
    const input = tokenNumber.value
    const inputInteger = parseInt(input)

    if(isNaN(inputInteger)) {
        alert("Place token count should be an integer")
        tokenNumber.value = editElementStore.getPlaceTokens
        event.target.blur()
        return
    }

    if(inputInteger < 0) {
        alert("Place token count should be positive or zero")
        tokenNumber.value = editElementStore.getPlaceTokens
        event.target.blur()
        return
    }

    editElementStore.setPlaceTokenNumber(tokenNumber.value)
    event.target.blur()
}

/**
 *  Handle user request to delete a place 
 */
function deletePlace() {
    editElementStore.deletePlace()
}
</script>

<template>
    <!--TODO: Find a way to incorporate keyboard shortcuts in the workflow-->
    <div>
        <div class="sim-container">
            <input type="text" v-model="label" class="input" @keydown.enter="handlePlaceLabelInput">
            <p>Change place label</p>
        </div>
        <div class="sim-container">
            <input type="number" v-model="tokenNumber" class="input" @keydown.enter="handlePlaceTokenInput">
            <p>Change place token number</p>
        </div>
        <div class="btn-container">
            <button @click="deletePlace">
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