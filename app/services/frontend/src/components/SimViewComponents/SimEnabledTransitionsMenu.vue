<script setup>
import { useEnabledTransitionsStore } from '@/components/stores/SimViewStores/EnabledTransitionsStore'

const transitionStore = useEnabledTransitionsStore()

function fireTransition(transition) {
    transitionStore.fireTransition(transition)
}

</script>

<template>
    <div class="menu-container">
        <p class="text">Enabled Transitions</p>
        <div v-for="transition in transitionStore.getEnabledTransitions" class="sim-container">
            <a  href="#"
                class="a-container"
                @click="fireTransition(transition)">
                {{ transition.label }}
            </a>
        </div>
        <div class="sim-container">
            <button>
                <img src="@/assets/SimButtons/refreshButton.svg">
            </button>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';

.a-container {
    display: block;
    height: 100%;
    width: 100%;
    text-decoration: none;
}

.tr-container {
    width: 90%;
    margin: 5%;
    background-color: rgb(9, 147, 240);
    border-radius: 5px;
}
</style>