<script setup>
    import NavBar from '@/components/NavBar.vue'
</script>

<template>
    <div id="app">
        <div class="main-container">
            <div class="top-container">
                <NavBar/>
            </div>
            <div class="bottom-container">
                <div class="side-bar-container">
                    <p>This is the side bar</p>
                </div>

                <div class="grid-plane-container">
                    <p>This is the grid plane</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/main-structure.css'
</style>