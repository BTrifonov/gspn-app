<script setup>
import {useElementStore} from '@/components/stores/EditElementStore.js'

import EditPlaceMenu from '@/components/EditViewComponents/EditElemMenus/EditPlaceMenu.vue'
import EditTransitionMenu from '@/components/EditViewComponents/EditElemMenus/EditTransitionMenu.vue'

import EditArcMenu from '@/components/EditViewComponents/EditElemMenus/EditArcMenu.vue';

const editElementStore = useElementStore()

</script>

<template>
    <div class="menu-container">
        <p class="text">Edit element</p>
        <div v-if="editElementStore.selectedPlace">
            <EditPlaceMenu/>
        </div>
        <div v-if="editElementStore.selectedArc">
            <EditArcMenu/>
        </div>
        <div v-if="editElementStore.selectedTransition">
            <EditTransitionMenu/>
        </div>
        <div class="sim-container" 
             v-if="!editElementStore.selectedArc && 
                                    !editElementStore.selectedPlace && 
                                        !editElementStore.selectedTransition">
            <p>Click once on an element</p>
        </div>
    </div>
</template>


<style scoped>
@import '@/assets/sidebar-submenu.css';
</style>