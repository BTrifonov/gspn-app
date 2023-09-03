<script setup>
import {usePlaneStore} from '@/components/stores/PlaneStore'

const planeStore = usePlaneStore()

function triggerDelete() {
    planeStore.triggerDelete = true
}

function triggerSave() {
    planeStore.triggerSave = true
}

</script>

<template>
    <div class="main-container">
        <div v-if="planeStore.editPlaneEnabled">
            <div class="input-container">
                <select v-model="planeStore.paperGrid" class="input">
                    <!--<option disabled value=""></option>-->
                    <option> None </option>
                    <option> Dot </option>
                    <option> Mesh </option>
                    <option> DoubleMesh </option>
                </select>
                <p class="text">Grid type</p>
            </div>

            <div class="input-container">
                <input type="range" min="1" max="10" step = "0.1" class="input" v-model="planeStore.paperGridSize">
                <p class="text">Grid size</p>
            </div>

            <div class="input-container">
                <input type="range" min="0.5" max="2" step="0.1" class="input" v-model="planeStore.paperScale">
                <p class="text">Plane Scale</p>
            </div>
            <div class="btn-container">
                <button @click="triggerDelete">
                    <img src="../../assets/EditPlaneButtons/delete.svg">
                </button>
                
                <button @click="triggerSave">
                    <img src="../../assets/EditPlaneButtons/save.svg">
                </button>
            </div>
        </div>

        <div v-else class="default-container">
            <p class="text">Click twice on the plane to edit it</p>
        </div>
    </div>
</template>

<style scoped>
.main-container {
    display: flex;
    flex-direction: column;

    justify-content: space-between;
}

.input-container {
    background-color: rgb(9, 147, 240);
    border-radius: 5px;
    margin-bottom: 4px;
}

.default-container {
    background-color: rgb(9, 147, 240);
    border-radius: 5px;
}

/**TODO: Move the button styles to the sidebar to reduce CSS code repetition in each submenu */
.btn-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    background-color: rgb(9, 147, 240);
    border-radius: 5px;
    margin-bottom: 0;
}

button {
    border-radius: 5px;
    background-color: silver;
}

button:active {
    background-color: grey;
}

.text {
    font-style:italic;

    margin: 0 auto;
}
.input {
    border-radius: 5px;
    width: 90%;
}

</style>