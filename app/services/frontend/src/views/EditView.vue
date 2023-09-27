<script setup>
import NavBar from '@/components/NavBar.vue'

import EditSideBar from '@/components/EditViewComponents/EditSideBar.vue';

import GridPlane from '@/components/EditViewComponents/GridPlane.vue';

</script>

<template>
    <div id="app">
        <div class="main-container">
            <div class="top-container">
                <NavBar/>
            </div>
            <div class="bottom-container">
                <div class="side-bar-container">
                    <EditSideBar/>
                </div>

                <div class="grid-plane-container">
                    <GridPlane/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/main-structure.css';
</style>