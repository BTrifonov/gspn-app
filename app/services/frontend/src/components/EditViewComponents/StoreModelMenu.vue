<script setup>
import { ref } from 'vue';

const files = ref([{name: "sample-model.json", selected: false}])
const fileName = ref(null)

function triggerSave() {
    files.value.push({name: fileName.value, selected:false})
    fileName.value = null
}

function triggerDelete(file) {
    const indexElem = files.value.indexOf(file)
    if(indexElem != -1) {
        files.value.splice(indexElem, 1)
    }
}

function printToConsole() {
    console.log("What's up")
}

</script>

<template>
    <div class="menu-container">
        <p class="text"> Store Model </p>
        
        <div class="outer-container">
            <div v-for="file in files" class="sim-container">
                <div class="file-name" @click="printToConsole">
                    {{ file.name }}
                </div>

                <div class="btn-container">
                    <button>
                        <img src="@/assets/EditPlaneButtons/save.svg">
                    </button>
                    <button @click="triggerDelete(file)">
                        <img src="@/assets/EditPlaneButtons/delete.svg">
                    </button>
                </div>
            </div>
        </div>

        <div class="sim-container">
            <input type="text" placeholder="Model name" v-model="fileName" class="input">

            <div class="btn-container">
                <button @click="triggerSave">
                    <img src="@/assets/EditPlaneButtons/save.svg">
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';

/*Styling specific to this menu only*/ 
.outer-container {
    flex-direction: column;
    display: flex;
}

.file-name {
    display: flex;
    width: 60%;
    background-color: rgb(9, 147, 240);
    margin: 0 auto;
}


/*-----------------------------------*/



/**Overwrite styling of the external stylesheet for the following classes */
.sim-container {
    flex-direction: row;
    justify-content: space-between;
}

.input {
    width: 60%;
    background-color: rgb(9, 147, 240);
}

.btn-container {
    width: 40%;
    justify-content: space-evenly;
}

/*-----------------------------------*/ 
</style>