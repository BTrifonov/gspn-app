<script setup>
import axios from 'axios';
import { ref } from 'vue'

//const displayedDropdown = ref(false)

function enableDropdown() {
  axios.get('/')
    .then(function(response) {
        console.log(response)
    }) //
    .catch(function(error) {
        console.log("Does not work")
    })
    .finally(function() {
        console.log("Finally")
    })
}

</script>

<template>
    <div class="navBar">
        <button class="btn" @click="enableDropdown">
            <img src="../assets/NavBarImg.svg" alt="Menu">
        </button>
        
        <div class="title"> GSPN Modelling and Simulation Tool</div>

        <div class="tumLogo">
            <img src="../assets/tum-logo.gif">
        </div>
    </div>
</template>

<style scoped>
.navBar {
    height:100%;
    width:100%;

    display: flex;
    justify-content: space-between;
    align-items: center;

    overflow: hidden;
}


.btn {
    background-color: silver;
}

.btn:active {
    background-color: grey;
}

/*
TODO: Place the text on equal dist from top and bottom of container
*/
.title {
    color: white;
    font-size: larger;
    font-style:italic;

    margin: 0 auto;
}
</style>
