<script setup>
import DrawMenu from '@/components/CreateElemMenu/DrawMenu.vue'
import EditElemMenu from '@/components/EditElemMenus/EditElemMenu.vue'
import EditPlaneMenu from '@/components/EditPlaneMenu/EditPlaneMenu.vue'
import SimulationMenu from '@/components/ExecSimulationMenu/SimulationMenu.vue'

</script>

<template>
    <div class="container">
        <div class="menu-container">
            <p class="text">Edit plane</p>
            <EditPlaneMenu/>
        </div>
        <div class="menu-container">
            <p class="text">Create element</p>
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
    </div>
</template>

<style scoped>
/**TODO: Refactor the CSS styling to reduce the CSS code in all other submenus */
.container {
   min-height: 100%;
   min-width: 100%;
   padding: 0px;
   
   background-color: rgb(9, 147, 240);

   display: flex;
   flex-direction: column;
   justify-content: flex-start;
   overflow: auto;
}

.menu-container {
    height: fit-content;
    width: 90%;
    padding: 2px;

    margin: 0 auto;

    background-color: blue;
    border-radius: 5px;

    margin-top: 2px;
    margin-bottom: 2px;

    overflow: auto;
}

.text {
    color: white;
    font-size: larger;
    font-style:italic;

    margin: 0 auto;
}
</style>