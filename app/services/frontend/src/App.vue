<script setup>
import axios from 'axios';
import { onUnmounted } from 'vue';


//TODO: Ensure that all models in the backend are deleted after
//leaving the web page
/*onUnmounted(()=>{
  //delete all models
  axios.delete("/models") 
        .then((response)=>{
          console.log("Successfully deleted the model dir")
        })
        .catch((err)=>{
          console.log(err)
        })
        .finally(()=>{
          //
        }) 
})*/
 

</script>
 
<template>
  <router-view></router-view>
</template>

<style scoped>
html, body {
  margin: 0px;
  height:100%;
}

#app {
  height:100%;
  margin: 0px;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
