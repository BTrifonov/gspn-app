<script setup>
import { useCreateElemStore } from '@/components/stores/EditViewStores/CreateElemStore.js';

const store = useCreateElemStore()

</script>

<template>
    <div class="menu-container">
        <p class="text">Create Element</p>

        <div class="btn-container">
            <button @click="store.setPlaceButton(true)">
                <img src="../../assets/BasicElements/place.svg">
            </button> 
        
            <button @click="store.setTransitionButton(true)"> 
                <img src="../../assets/BasicElements/transition.svg">
            </button>
        
        
            <button @click="store.setImmediateTransitionButton(true)"> 
                <img src="../../assets/BasicElements/immediateTransition.svg">
            </button>
        
            <!--<button @click="store.setArcButton(true)">
                <img src="../../assets/MenuIcons/arrow-right.png">
            </button>--> 
        </div>
    </div>
</template>


<style scoped>
@import '@/assets/sidebar-submenu.css';
</style>