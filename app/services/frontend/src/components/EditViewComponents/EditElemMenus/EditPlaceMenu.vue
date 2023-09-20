<script setup>
import { useElementStore } from '@/components/stores/EditElementStore';
import { watch } from 'vue';
import { ref } from 'vue';

const editElementStore = useElementStore()

//Initial values are taken from the element store
const label = ref(editElementStore.getPlaceLabel)
const tokens = ref(editElementStore.getPlaceTokens)

function deletePlace() {
    editElementStore.deletePlace()
}

//Update the values, if a new place is selected, before unselecting a previous one
watch(() => editElementStore.selectedElement, (newVal)=>{
    if(newVal!=null){
        label.value = editElementStore.getPlaceLabel
        tokens.value = editElementStore.getPlaceTokens
    }
})

watch(tokens, (newVal) => {
    editElementStore.setPlaceTokenNumber(newVal)
})

watch(label, (newVal) => {
    editElementStore.setPlaceLabel(newVal)
})
</script>

<template>
    <div>
        <div class="sim-container">
            <input type="text" v-model="label" class="input">
            <p>Change place label</p>
        </div>
        <div class="sim-container">
            <input type="number" v-model="tokens" class="input">
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