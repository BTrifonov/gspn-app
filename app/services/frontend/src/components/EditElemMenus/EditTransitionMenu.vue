<script setup>
import { useElementStore } from '@/components/stores/ElementStore';
import { ref, watch } from 'vue';

const elementStore = useElementStore()

const heightInput = ref(0)
const widthInput = ref(0)
const tokenDistribution = ref(null)

function deleteTransition() {
    elementStore.selectedTransition.remove()
    elementStore.selectedTransition = null
}


watch(heightInput, (newHeight) => {
    const selectedTransition = elementStore.selectedTransition
    const width = selectedTransition.get('size').width
    selectedTransition.resize(width, newHeight)
})

watch(widthInput, (newWidth) => {
    const selectedTransition = elementStore.selectedTransition
    const height = selectedTransition.get('size').height
    selectedTransition.resize(newWidth, height)
})

</script>

<template>
    <div>
        <div class="input-container">
            <input type="text" placeholder="Transition id" class="input">
            <p class="text">Change transition id</p>
        </div>

        <div class="input-container">
            <input type="range" placeholder="Transition height" v-model="heightInput" class="input">
            <p class="text">Change transition height</p>
        </div>

        <div class="input-container">
            <input type="range" placeholder="Transition width" v-model="widthInput" class="input">
            <p class="text">Change transition width</p>
        </div>

        <div class="input-container">
            <select v-model="tokenDistribution" class="input">
                <option value="">Exponential</option>
                <option value="">General</option>
            </select>
            <p class="text">Change transition token distribution</p>
        </div>
        <div>
            <button @click="deleteTransition">Delete</button>
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
}

.text {
    font-style:italic;
    margin: 0 auto;
}

button {
    background-color: silver;
    border-radius: 5px;
}

button:active {
    background-color: grey;
}
</style>