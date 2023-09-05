<script setup>
import SimulationMenu from '@/components/SimViewComponents/SimulationMenu.vue';
import SimEnabledTransitionsMenu from '@/components/SimViewComponents/SimEnabledTransitionsMenu.vue';


import SimTracebackMenu from '@/components/SimViewComponents/SimTracebackMenu.vue';
import ChangeViewMenu from '@/components/ChangeViewMenu.vue';
</script>

<template>
    <div class="container">
        <div>
            <SimulationMenu/>
        </div>
        <div>
            <SimEnabledTransitionsMenu/>
        </div>
        <div>
            <SimTracebackMenu/>
        </div>
        <div>
            <ChangeViewMenu/>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-structure.css';


</style>