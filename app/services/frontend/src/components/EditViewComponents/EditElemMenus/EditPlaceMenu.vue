<script setup>
import { useElementStore } from '@/components/stores/EditElementStore';
import { watch } from 'vue';
import { ref } from 'vue';

const editElementStore = useElementStore()

const tokenInput = ref(0)
const label = ref('')

function deletePlace() {
    editElementStore.deletePlace()
    editElementStore.unselectAll()
}

watch(tokenInput, (newVal) => {
    editElementStore.setPlaceTokenNumber(newVal)
})

watch(label, (newVal) => {
    editElementStore.setPlaceLabel(newVal)
})
</script>

<template>
    <div>
        <div class="sim-container">
            <input type="text" placeholder="Place id" v-model="label" class="input">
            <p>Change place label</p>
        </div>
        <div class="sim-container">
            <input type="number" placeholder="Token number" v-model="tokenInput" class="input">
            <p>Change place token number</p>
        </div>
        <div class="btn-container">
            <button @click="deletePlace">
                <img src="@/assets/EditPlaneButtons/delete.svg">
            </button>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sidebar-submenu.css';

.btn-container {
    justify-content: center;
}
</style>