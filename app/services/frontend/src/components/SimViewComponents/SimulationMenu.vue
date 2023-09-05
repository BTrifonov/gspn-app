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

        <div class="sim-container">
            <input type="range" min="0.5" max="2" step="0.5" class="input">
            <p>Simulation speed</p> 
        </div>
    </div>
</template>



<style scoped>
@import '@/assets/sidebar-submenu.css';
</style>