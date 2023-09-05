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
        <div class="sim-container">
            <input type="text" placeholder="Transition id" class="input">
            <p>Change transition id</p>
        </div>

        <div class="sim-container">
            <input type="range" placeholder="Transition height" v-model="heightInput" class="input">
            <p>Change transition height</p>
        </div>

        <div class="sim-container">
            <input type="range" placeholder="Transition width" v-model="widthInput" class="input">
            <p>Change transition width</p>
        </div>

        <div class="sim-container">
            <select v-model="tokenDistribution" class="input">
                <option value="">Exponential</option>
                <option value="">General</option>
            </select>
            <p>Change transition token distribution</p>
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