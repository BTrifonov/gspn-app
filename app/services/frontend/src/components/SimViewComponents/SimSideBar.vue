<script setup>
import ChangeViewMenu from '@/components/ChangeViewMenu.vue';

import SimulationMenu from '@/components/SimViewComponents/SimulationMenu.vue';
</script>

<template>
    <div class="container">
        <div>
            <SimulationMenu/>
        </div>
        <div>
            <ChangeViewMenu/>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-structure.css';


</style>