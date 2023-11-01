<script setup>
</script>

<template>
    <div class="outer-container">
        <div class="container">
            <p class="description">Welcome to the Generalized Stochastic Petri Net Modelling and Simulation Tool <br> </p>
            <p class="description">The modelling tool has 3 main views (modes), which can be changed at any given moment from the <b>Change tool mode</b> menu in the sidebar <br> </p>
            <p class="description">The 3 views of the tool are:</p>
            <ul>
                <li> Home View </li>
                <li> Edit View </li>
                <li> Simulation View </li> 
            </ul>
        </div>

        
        <div class="container">
            <h2><b>Home View</b></h2>
            <p class="description">This is the initially loaded view, available to users when they open the page. Here users can read this short tutorial about the main functionalities of the tool.</p>
            <p class="description">From here users can switch to the <b>Edit View</b> and the <b>Simulation View</b></p>
        </div>
        
        
        <div class="container">
            <h2><b>Edit View</b></h2>
            <p class="description">In this mode users can create their GSPN models and save them to be able to retrieve the models for simulation later. </p>
            <p class="description"> From the sidebar in the edit view users can create PN elements from the <b>Create Element</b> menu by clicking on the desired element</p>
            <p class="description"> To modify element properties users should click once on the desired element. A new menu is then visible in the sidebar, allowing to alter the element properties </p>
            <p class="description"> In the <b>Store Model</b> menu users can give a name to their model and persist it by clicking the save button. The model will be now available in the simulation view</p>
            <p class="description"> The <b>Edit Plane</b> menu allows to zoom in or out the modelling plane, change the type of the grid and increase or decrease the grid cell size. </p> 
        </div> 

        <div class="container">
            <h2><b>Simulation View</b></h2>
            <p class="description"> In this mode users can simulate the models, created in the edit view.</p>
            <p class="description"> From the <b>Choose Model</b> menu in the sidebar users can select with which model to work.</p>
            <p class="description"> Changes to the model during simulation <b>are not persisted</b>.</p>
            <p class="description"> The <b>Choose Simulation Mode</b> menu enables users to select between automatic or manual simulation.</p>
            <p class="description">In manual simulation the user clicks on an enabled transition to fire, whereas in automatic the enabled transitions with lowest delay fires first.</p>
            <p class="description">The <b>Elapsed Time</b> displays the global simulation time, which increases once a timed transition fires</p>
            <p class="description"> Within the <b>Path Traceback</b> menu users can see the place markings, time and fired transition after each transition firing. </p>
        </div>

    </div>
</template>


<style scoped>
.outer-container {
    min-height: 100%;
    min-width: 100%; 
    
    display: flex;
    flex-direction: column;
}


li {
    text-align: left;
    font-style: italic;
    font-size: medium;
}


p.description {
    text-align: left;
    font-style: italic;
    font-size: large;
}

.image {
    border:2px solid black; 
    height: 20%;
    width: 40%;
    }
</style>