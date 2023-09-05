<script setup>
</script>

<template>
    <div class="menu-container">
        <p class="text"> Execute Simulation </p>

        <div class="btn-container">
            <button>
                <img src="../../assets/SimButtons/startButton.svg">
            </button>

            <button>
                <img src="../../assets/SimButtons/stopButton.svg">
            </button>

            <button>
                <img src="../../assets/SimButtons/restartButton.svg">
            </button>

            <button>
                <img src="../../assets/SimButtons/skipToStartButton.svg">
            </button>

            <button>
                <img src="../../assets/SimButtons/skipToEndButton.svg">
            </button>
        </div>

        
        <div class="menu-container">
            <div class="btn-container">
                <input type="range" min="0.5" max="2" step="0.5" class="input"> 
            </div>
            <p class="text">Simulation speed</p>
        </div>

    </div>
</template>



<style scoped>
@import '@/assets/sidebar-submenu.css';

.input-container {
    margin-top: 2px;
    background-color: rgb(9, 147, 240);
    border-radius: 5px;
}

.input {
    border-radius: 5px;
    width: 100%;
}
</style>