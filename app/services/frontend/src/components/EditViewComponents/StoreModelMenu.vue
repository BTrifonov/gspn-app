<script setup>
import { ref } from 'vue';
import {useModelStore} from '@/components/stores/ModelStore.js'

const modelStore = useModelStore()
const modelName = ref('')

/**TODO: Think about possible errors: empty user input */
function saveModel() {
    modelStore.saveModel(modelName.value)
    
    modelName.value = null
}

function deleteModel(model) {
   modelStore.deleteModel(model)
}

function updateModel(model) {
    modelStore.updateModel(model)
}

function handleModelSelection(model) {
    if(!model.selected) {
        //model.selected is false -> user selects model
        modelStore.selectModel(model)
    }
    else {
        //model.selected is true -> user unselects model
        modelStore.unselectModel(model)
    }
}

</script>
<template>
    <div class="menu-container">
        <p class="text"> Store Model </p>
        
        <div class="outer-container">
            <div v-for="model in modelStore.getModels" class="sim-container">
                <div>
                    <a  href="#" 
                        class="a-container" 
                        @click="handleModelSelection(model)"
                        :style="{ color: model.selected ? 'white' : 'blue' }">
                        
                        {{ model.name }}
                    </a>
                </div>
                <div class="btn-container">
                    <button 
                        @click="updateModel(model)" 
                        :style="{ 'pointer-events': model.selected ? 'auto' : 'none', opacity: model.selected ? 1 : 0.4 }"
                        :disabled="!model.selected">
                        
                        <img src="@/assets/EditPlaneButtons/save.svg">
                    </button>
                    <button 
                        @click="deleteModel(model)" 
                        :style="{ 'pointer-events': model.selected ? 'auto' : 'none', opacity: model.selected ? 1 : 0.4 }"
                        :disabled="!model.selected">
                        
                        <img src="@/assets/EditPlaneButtons/delete.svg">
                    </button>
                </div>
            </div>
        </div>

        <div class="sim-container">
            <input type="text" placeholder="Model name" v-model="modelName" class="input">

            <div class="btn-container">
                <button @click="saveModel()">
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

.a-container {
    display: block;
    height: 100%;
    width: 100%;
    text-decoration: none;
}
/*-----------------------------------*/

/**Overwrite styling of the external stylesheet for the following classes */
.sim-container {
    flex-direction: row;
    justify-content: space-between;
}

.input {
    width: 60%;
}

.btn-container {
    width: 40%;
    justify-content: space-evenly;
}

/*-----------------------------------*/ 
</style>