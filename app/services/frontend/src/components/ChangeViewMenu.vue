<script setup>
</script>


<template>
    <div class="menu-container">
        <p class="text">Change tool mode</p>
        
        <div class="btn-container">
            <button>
                <router-link to="/">
                    <img src="../assets/HomeSideBar/homeModeButton.svg">
                </router-link>
            </button>
            <button>
                <router-link to="/edit-view">
                    <img src="../assets/HomeSideBar/editModeButton.svg">
                </router-link>
            </button>
            <button>
                <router-link to="/simulation-view">
                    <img src="../assets/HomeSideBar/simModeButton.svg">
                </router-link>
            </button>
        </div>
    </div>
</template>

<style scoped>
@import '../assets/sidebar-submenu.css';
</style>