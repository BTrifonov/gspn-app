<script setup>
</script>

<template>
    <div class="menu-container">
        <p class="text">Enabled Transitions</p>
        <div class="sim-container">
            <p>Here will be displayed all enabled transitions, after choosing a model
            </p>
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

.tr-container {
    width: 90%;
    margin: 5%;
    background-color: rgb(9, 147, 240);
    border-radius: 5px;
}
</style>