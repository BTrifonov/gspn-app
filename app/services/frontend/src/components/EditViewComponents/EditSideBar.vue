<script setup>
import CreateElemMenu from '@/components/EditViewComponents/CreateElemMenu.vue';
import EditElemMenu from '@/components/EditViewComponents/EditElemMenus/EditElemMenu.vue';
import EditPlaneMenu from '@/components/EditViewComponents/EditPlaneMenu.vue';


import ChangeViewMenu from '@/components/ChangeViewMenu.vue';


</script>

<template>
    <div class="container">
        <div class="menu-container">
            <p class="text">Edit plane</p>
            <EditPlaneMenu/>
        </div>
        <div>
            <CreateElemMenu/>
        </div>
        <div class="menu-container">
            <p class="text">Edit element</p>
            <EditElemMenu/>
        </div>
        <div>
            <ChangeViewMenu/>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-structure.css';
@import '@/assets/sidebar-submenu.css';
</style>