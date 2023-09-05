<script setup>
import ChangeViewMenu from '@/components/ChangeViewMenu.vue';
</script>

<template>
    <div class="container">
        <ChangeViewMenu/>
        <!--<div class="menu-container">
            <p class="text">Change tool mode</p>
            <ChangeViewMenu/>
        </div>-->
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-structure.css';

.container {
    justify-content: center;
}
</style>