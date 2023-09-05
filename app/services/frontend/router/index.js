import {createRouter, createWebHistory} from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

import SimulationView from '@/views/SimulationView.vue'
import EditView from '@/views/EditView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', name: 'Home', component: HomeView},
        {path: '/about', name: 'About', component: AboutView},
        {path: '/simulation-view', name: 'Simulation', component: SimulationView},
        {path: '/edit-view', name: 'Edit', component: EditView}
    ]
})

export default router