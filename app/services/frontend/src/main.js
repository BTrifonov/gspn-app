import './style.css'
import '../node_modules/jointjs/dist/joint.css';

//import 'bootstrap/dist/css/bootstrap.css';
import { createApp } from 'vue';

import axios from 'axios';

//import axios from 'axios';
import { createPinia } from 'pinia';

//import {joint} from 'jointjs'

import App from './App.vue';
//import router from './router';


const app = createApp(App);

//TODO: Why does this approach not work and one should manually import the jointjs library in all components
//app.use(joint)

//Bind to the FastAPI backend
axios.defaults.baseURL = 'http://localhost:5000/';

//Register router
//app.use(router);

//Register pinia
const store = createPinia()
app.use(store)


//Mount the application
app.mount('#app');

