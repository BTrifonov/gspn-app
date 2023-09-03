<script setup>
import { useElementStore } from '@/components/stores/ElementStore';
import { watch } from 'vue';
import { ref } from 'vue';

const elementStore = useElementStore()

const radiusInput = ref(0)
const tokenInput = ref(0)
const label = ref('')


function deletePlace() {
    elementStore.selectedPlace.remove()
    elementStore.selectedPlace = null
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
        <div class="input-container">
            <input type="text" placeholder="Place id" v-model="label" class="input">
            <p class="text">Change place id</p>
        </div>
        <div class="input-container">
            <input type="range" v-model="radiusInput" class="input">
            <p class="text">Change place radius</p>
        </div>
        <div class="input-container">
            <input type="number" placeholder="Token number" v-model="tokenInput" class="input">
            <p class="text">Change place token number</p>
        </div>
        <div>
            <button @click="deletePlace">Delete</button>
        </div>
    </div>
</template>

<style scoped>
.input-container {
    background-color: rgb(9, 147, 240);
    border-radius: 5px;
    margin-bottom: 4px;
}

.input {
    border-radius: 5px;
    height: 100%;
    width: 100%;
}

.text {
    font-style:italic;

    margin: 0 auto;
}

button {
    border-radius: 5px;
    background-color: silver;
}

button:active {
    background-color: gray;
}
</style>