<script setup>
import { ref } from 'vue';

const files = ref(['File1', 'File2'])
const fileName = ref(null)

function triggerSave() {
    files.value.push(fileName.value)
}

function triggerDelete() {
    const indexElem = files.value.indexOf(fileName.value)
    if(indexElem != -1) {
        files.value.splice(indexElem, 1)
    }
}

</script>

<template>
    <div class="menu-container">
        <p class="text"> Store Model </p>
        
        <div class="sim-container">
            <ul>
                <li v-for="file in files">
                    {{ file }}
                </li>  
            </ul>   
        </div>


        <div class="sim-container">
            <input type="text" placeholder="Model name" v-model="fileName" class="input">

            <div class="btn-container">
                <button @click="triggerSave">
                    <img src="@/assets/EditPlaneButtons/save.svg">
                </button>
                <button @click="triggerDelete">
                    <img src="@/assets/EditPlaneButtons/delete.svg">
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';

.sim-container {
    flex-direction: row;
    justify-content: space-between;
}

.input {
    width: 60%;
    background-color: rgb(9, 147, 240);
}

.btn-container {
    width: 35%;
    justify-content: space-evenly;
}
</style>