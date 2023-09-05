<script setup>
import {ref, watch} from 'vue'
import {useElementStore} from '@/components/stores/ElementStore'

import EditPlaceMenu from '@/components/EditViewComponents/EditElemMenus/EditPlaceMenu.vue'
import EditTransitionMenu from '@/components/EditViewComponents/EditElemMenus/EditTransitionMenu.vue'
import EditArcMenu from '@/components/EditViewComponents/EditElemMenus/EditArcMenu.vue'


const elementStore = useElementStore()

const selectedPlace = ref(null)
const selectedTransition = ref(null)
const selectedArc = ref(null)

//Watchers to check which element the user has chosen
//Primary goal to update the local variables
watch(() => elementStore.selectedPlace, (newVal) => {
    selectedPlace.value = newVal
})

watch(() => elementStore.selectedTransition, (newVal) => {
    selectedTransition.value = newVal
})

watch(() => elementStore.selectedArc, (newVal) => {
    selectedArc.value = newVal
})

</script>

<template>
    <div class="menu-container">
        <p class="text">Edit element</p>
        <div v-if="selectedPlace != null">
            <EditPlaceMenu/>
        </div>
        <div v-if="selectedArc != null">
            <EditArcMenu/>
        </div>
        <div v-if="selectedTransition != null">
            <EditTransitionMenu/>
        </div>
        <div class="sim-container" v-if="selectedArc==null && selectedPlace==null && selectedTransition==null">
            <p>Click once on an element</p>
        </div>
    </div>
</template>


<style scoped>
@import '@/assets/sidebar-submenu.css';
</style>