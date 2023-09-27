<script setup>
import {usePlaneStore} from '@/components/stores/EditViewStores/EditPlaneStore.js';

const planeStore = usePlaneStore()

</script>

<template>
    <div class="menu-container">
        <p class="text">Edit plane</p>
        <div v-if="planeStore.editPlaneEnabled">
            <div class="sim-container">
                <select v-model="planeStore.paperGrid" class="input">
                    <option> None </option>
                    <option> Dot </option>
                    <option> Mesh </option>
                    <option> DoubleMesh </option>
                </select>
                <p>Grid type</p>
            </div>

            <div class="sim-container">
                <input type="range" min="1" max="10" step = "0.01" class="input" v-model="planeStore.paperGridSize">
                <p>Grid size</p>
            </div>

            <div class="sim-container">
                <input type="range" min="0.5" max="2" step="0.01" class="input" v-model="planeStore.paperScale">
                <p>Plane Scale</p>
            </div>
        </div>
        <div v-else class="sim-container">
            <p>Click twice on the plane to edit it</p>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';

.btn-container {
    justify-content: space-evenly;
}

</style>