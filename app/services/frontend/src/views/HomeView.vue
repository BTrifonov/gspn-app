<script setup>
import NavBar from '@/components/NavBar.vue'

import HomeSideBar from '@/components/SideBars/HomeSideBar.vue'
</script>

<template>
    <div id="app">
        <div class="main-container">
            <div class="top-container">
                <NavBar/>
            </div>
            <div class="bottom-container">
                <div class="side-bar-container">
                    <HomeSideBar/>
                </div>

                <div class="grid-plane-container">
                    <h1> Short tutorial on how to use the tool </h1>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/main-structure.css';

.bottom-container {
    background-color: rgb(9, 147, 240);;
}

</style>