<script setup>
import {useModelStore} from '@/components/stores/ModelStore'

const modelStore = useModelStore()

</script>

<template>
    <div class="menu-container">
        <p class="text"> Choose model </p>
        
        <div>
            <div v-for="model in modelStore.getModels" class="sim-container">
                {{ model.name }}
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';

</style>