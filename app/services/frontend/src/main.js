import './style.css'
import '../node_modules/jointjs/dist/joint.css';

import { createApp } from 'vue';
import axios from 'axios';

import { createPinia } from 'pinia';

import App from './App.vue';

import {createRouter, createWebHistory} from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

import SimulationView from '@/views/SimulationView.vue'
import EditView from '@/views/EditView.vue'


const app = createApp(App);

//Bind to the FastAPI backend
axios.defaults.baseURL = 'https://csl.bpm.in.tum.de/boris/';

//Router configuration
//TODO: By moving it to external file the import does not work
//------------------------------------
const router = createRouter({
    history: createWebHistory('/boris_frontend/'),
    routes: [
        {path:'/', name: 'Home', component: HomeView},
        {path: '/about', name: 'About', component: AboutView},
        {path: '/simulation-view', name: 'Simulation', component: SimulationView},
        {path: '/edit-view', name: 'Edit', component: EditView}
    ]
})

//------------------------------------

//Register router
app.use(router);


//Register pinia
const store = createPinia()
app.use(store)


//Mount the application
app.mount('#app');

