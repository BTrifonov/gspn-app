<script setup>
</script>

<template>
    <div class="main-container">
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

        
        <div class="input-container">
            <input type="range" min="0.5" max="2" step="0.5" class="input">
            <p class="text">Simulation speed</p>
        </div>
    </div>
</template>



<style scoped>
.main-container {
    display: flex;
    flex-direction: column;

    justify-content: space-between;
}

.btn-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    margin-bottom: 4px;
    width: 100%;
    overflow: auto;

    background-color: rgb(9, 147, 240);
    border-radius: 5px;
}

.input-container {
    background-color: rgb(9, 147, 240);
    border-radius: 5px;
}

.text {
    font-style:italic;
    margin: 0 auto;
}

.input {
    border-radius: 5px;
    width: 100%;
}

button {
    border-radius: 5px;
    background-color: silver;
}

button:active {
    background-color: grey;
}
</style>