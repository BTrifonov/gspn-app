import axios from 'axios';

/**
 * Send HTTP GET request to the backend to retrieve a model
 * @param {*} params {name: modelName}
 * @returns 
 */
export async function getModel(params) {
    return axios.get('/model', {params})
                    .then((response) => {
                        return response.data
                    })
                    .catch((error) => {
                        //should be catched by SimGridPlane.vue
                        throw error
                    })
}

/**
 * Send HTTP POST request to the backend to fire transition
 * with transition_id of the model, passed in data
 * @param {*} params {name: modelName, transition_id: transitionId}
 * @param {*} data {model: modelJSON}
 * @returns 
 */
export async function fireTransition(params, data) {
    return axios.post('/model/fire-transition', {params, data})
                    .then((response) => {
                        return response.data
                    })
                    .catch((error) => {
                        return error
                    })
}

/**
 * Find the enabled transitions in the model, passed in data
 * @param {*} params Currently not used
 * @param {*} data {model: modelJSON}
 * @returns 
 */
export async function findEnabledTransitions(params, data) {
    return axios.post('/model/enabled-transitions', { data})
                    .then((response)=>{
                        return response.data
                    })
                    .catch((error)=>{
                        return error
                    })
}