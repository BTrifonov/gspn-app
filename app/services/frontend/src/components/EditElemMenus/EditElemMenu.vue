<script setup>
import {ref, watch} from 'vue'
import {useElementStore} from '@/components/stores/ElementStore'

import EditPlaceMenu from '@/components/EditElemMenus/EditPlaceMenu.vue'
import EditTransitionMenu from '@/components/EditElemMenus/EditTransitionMenu.vue'
import EditArcMenu from '@/components/EditElemMenus/EditArcMenu.vue'

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
    <div class="main-container">
        <div v-if="selectedPlace != null">
            <EditPlaceMenu/>
        </div>
        <div v-if="selectedArc != null">
            <EditArcMenu/>
        </div>
        <div v-if="selectedTransition != null">
            <EditTransitionMenu/>
        </div>
        <div v-if="selectedArc==null && selectedPlace==null && selectedTransition==null" class="default-container">
            <p class="text">Click once on an element</p>
        </div>
    </div>
</template>


<style scoped>
.main-container {
    display: flex;
    flex-direction: column;

    justify-content: space-between;
}

.default-container {
    background-color: rgb(9, 147, 240);
    border-radius: 5px;
}

.text {
    font-style:italic;
    margin: 0 auto;
}


</style>