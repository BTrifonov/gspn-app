<script setup>
import NavBar from '@/components/NavBar.vue'
import GridPlane from '@/components/GridPlane.vue'
import SideBar from '@/components/SideBar.vue'
</script>

<template>
  <div class="main-container">
    <div class="top-container">
      <NavBar/>
    </div>
    <div class="bottom-container">
      <div class="side-bar-container">
        <SideBar/>
      </div>

      <div class="grid-plane-container">
        <GridPlane/>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*TODO: Find another way to import the css style*/
 @import '../../node_modules/jointjs/dist/joint.css';

.main-container {
  height: 100%;

  display: flex;
  flex-direction: column;
}

.top-container {
    height: 5%;
    background-color: blue;
}

.bottom-container {
    height: 95%;
    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.side-bar-container {
    width: 15%;
    border-right: 4px solid blue;
}

.grid-plane-container {
    width: 85%;
  }

</style>