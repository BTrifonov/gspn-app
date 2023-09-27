import './style.css'
import '../node_modules/jointjs/dist/joint.css';

import { createApp } from 'modules/vue';
import axios from 'modules/axios';

import { createPinia } from 'modules/pinia';

import App from './App.vue';

import {createRouter, createWebHistory} from 'modules/vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

import SimulationView from '@/views/SimulationView.vue'
import EditView from '@/views/EditView.vue'


const app = createApp(App);

//Bind to the FastAPI backend
axios.defaults.baseURL = 'http://localhost:7000/';

//Router configuration
//TODO: By moving it to external file the import does not work
//------------------------------------
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', name: 'Home', component: HomeView},
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

