<script setup>
import {useElementStore} from '@/components/stores/EditElementStore'

import EditPlaceMenu from '@/components/EditViewComponents/EditElemMenus/EditPlaceMenu.vue'
import EditTransitionMenu from '@/components/EditViewComponents/EditElemMenus/EditTransitionMenu.vue'


const editElementStore = useElementStore()

</script>

<template>
    <div class="menu-container">
        <p class="text">Edit element</p>
        <div v-if="editElementStore.selectedPlace != null">
            <EditPlaceMenu/>
        </div>
        <!--<div v-if="selectedArc != null">
            <EditArcMenu/>
        </div>-->
        <div v-if="editElementStore.selectedTransition != null">
            <EditTransitionMenu/>
        </div>
        <div class="sim-container" v-if="editElementStore.selectedArc==null && editElementStore.selectedPlace==null && editElementStore.selectedTransition==null">
            <p>Click once on an element</p>
        </div>
    </div>
</template>


<style scoped>
@import '@/assets/sidebar-submenu.css';
</style>