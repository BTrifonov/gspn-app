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

/*
.btn-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    background-color: rgb(9, 147, 240);
    border-radius: 5px;
    margin-bottom: 0;
}

button {
    border-radius: 5px;
    background-color: silver;
}

button:active {
    background-color: grey;
}
*/
</style>