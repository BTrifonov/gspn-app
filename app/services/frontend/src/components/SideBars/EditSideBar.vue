<script setup>
import DrawMenu from '@/components/CreateElemMenu/DrawMenu.vue'
import EditElemMenu from '@/components/EditElemMenus/EditElemMenu.vue'
import EditPlaneMenu from '@/components/EditPlaneMenu/EditPlaneMenu.vue'
import SimulationMenu from '@/components/ExecSimulationMenu/SimulationMenu.vue'

import ChangeViewMenu from '@/components/ChangeViewMenu.vue';

</script>

<template>
    <div class="container">
        <div class="menu-container">
            <p class="text">Edit plane</p>
            <EditPlaneMenu/>
        </div>
        <div>
            <DrawMenu/>
        </div>
        <div class="menu-container">
            <p class="text">Edit element</p>
            <EditElemMenu/>
        </div>
        <div class="menu-container">
            <p class="text">Execute Simulation</p>
            <SimulationMenu/>
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