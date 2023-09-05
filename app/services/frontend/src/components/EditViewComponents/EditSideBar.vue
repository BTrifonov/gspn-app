<script setup>
import CreateElemMenu from '@/components/EditViewComponents/CreateElemMenu.vue';
import EditElemMenu from '@/components/EditViewComponents/EditElemMenus/EditElemMenu.vue';
import EditPlaneMenu from '@/components/EditViewComponents/EditPlaneMenu.vue';


import ChangeViewMenu from '@/components/ChangeViewMenu.vue';


</script>

<template>
    <div class="container">
        <div>
            <EditPlaneMenu/>
        </div>
        <div>
            <CreateElemMenu/>
        </div>
        <div>
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