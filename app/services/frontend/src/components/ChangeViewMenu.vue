<script setup>
</script>


<template>
    <div class="btn-container">
        <button>
            <router-link to="/">Home</router-link>
        </button>
        <button>
            <router-link to="/edit-view">Edit Mode</router-link>
        </button>
        <button>
            <router-link to="/simulation-view">Sim Mode</router-link>
        </button>
    </div>
</template>

<style scoped>
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
</style>