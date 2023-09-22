import axios from 'axios';

export async function getModel(params) {
    return axios.get('/model', {params})
                    .then((response) => {
                        return response.data
                    })
                    .catch((error) => {
                        return err
                    })
}

export async function fireTransition(params, data) {
    return axios.post('/model/fire-transition', {params, data})
                    .then((response) => {
                        return response.data
                    })
                    .catch((error) => {
                        return error
                    })
}

export async function findEnabledTransitions(params, data) {
    return axios.post('/model/enabled-transitions', { data})
                    .then((response)=>{
                        return response.data
                    })
                    .catch((error)=>{
                        return error
                    })
}