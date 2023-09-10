<script setup>
import { useElementStore } from '@/components/stores/EditElementStore';
import { watch } from 'vue';
import { ref } from 'vue';

const elementStore = useElementStore()

const radiusInput = ref(0)
const tokenInput = ref(0)
const label = ref('')


function deletePlace() {
    elementStore.selectedPlace.remove()
    elementStore.unselectAll()
}

watch(radiusInput, (newVal) => {
    elementStore.selectedPlace.resize(newVal, newVal)
})

watch(tokenInput, (newVal) => {
    elementStore.selectedPlace.attr('tokenNumber/text', newVal)
})

watch(label, (newVal) => {
    elementStore.selectedPlace.attr('label/text', newVal)
})

</script>

<template>
    <div>
        <div class="sim-container">
            <input type="text" placeholder="Place id" v-model="label" class="input">
            <p>Change place id</p>
        </div>
        <div class="sim-container">
            <input type="range" v-model="radiusInput" class="input">
            <p>Change place radius</p>
        </div>
        <div class="sim-container">
            <input type="number" placeholder="Token number" v-model="tokenInput" class="input">
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