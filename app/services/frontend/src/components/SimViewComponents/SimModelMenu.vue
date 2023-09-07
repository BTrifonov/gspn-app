<script setup>
import {useModelStore} from '@/components/stores/ModelStore'

const modelStore = useModelStore()

function selectUnselectModel(model) {
    modelStore.selectUnselectModel(model)
}

</script>

<template>
    <div class="menu-container">
        <p class="text"> Choose model </p>
        
        <div>
            <div v-for="model in modelStore.getModels" class="sim-container">
                    <a  href="#" 
                        class="a-container" 
                        :style="{ color: model.selected ? 'white' : 'blue' }"
                        @click="selectUnselectModel(model)">
                    
                        {{ model.name }}
                    
                    </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';

.a-container {
    display: block;
    height: 100%;
    width: 100%;
    text-decoration: none;
}
</style>