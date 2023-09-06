<script setup>
    import NavBar from '@/components/NavBar.vue';
    import SimSideBar from '@/components/SimViewComponents/SimSideBar.vue';
    import SimGridPlane from '@/components/SimViewComponents/SimGridPlane.vue';
</script>

<template>
    <div id="app">
        <div class="main-container">
            <div class="top-container">
                <NavBar/>
            </div>
            <div class="bottom-container">
                <div class="side-bar-container">
                    <SimSideBar/>
                </div>

                <div class="grid-plane-container">
                    <SimGridPlane/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/main-structure.css'
</style>