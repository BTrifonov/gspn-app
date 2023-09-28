import axios from 'axios';

/**
 * Send HTTP POST request to the backend to save a model
 * Used by GridPlane.vue component
 * @param {*} modelName Name of the model
 * @param {*} modelJSON JSON file, representing the model
 * @returns 
 */
export async function saveModel(modelName, modelJSON) {
    const data = {
        model: modelJSON
    }

    const params = {
        name: modelName
    }

    return axios.post('/model', { data, params })
            .then((response) => {
                return String("Saved successfully model: " + modelName)
            })
            .catch((err) => {
                return String("The following error occured, while trying to save a model:" + err)
            })  
            .finally(() => {
                //            
            })
}

/**
 * Send HTTP PUT request to the backend to update a model
 * Used by GridPlane.vue component
 * @param {*} modelName Name of the model
 * @param {*} modelJSON JSON file, representing the model
 * @returns 
 */
export async function updateModel(modelName, modelJSON) {
    const data = {
        model: modelJSON
    }

    const params = {
        name: modelName
    }
    
    return axios.put('/model', {data, params})
            .then((response) => {
                return String("Updated successfully model: " + modelName)
            })
            .catch((err) => {
                return String("Following error occured, while updating model " + modelName + ": " + err)
            })
            .finally(() => {
                //
            })
}

/**
 * Send HTTP DELETE request to the backend to delete a model
 * @param {*} modelName Name of the model
 * @returns 
 */
export async function deleteModel(modelName) {
    const params = {
        name:modelName
    }

    return axios.delete('/model', {params})
            .then((response) => {
                return String("Deleted successfully model: " + modelName)
            })
            .catch(function(err) {
                return String("Following error occured, while deleting model " + modelName + ": " + err)
            })
            .finally(function() {
                //
            })
}

/**
 * Send HTTP GET request to the backend to fetch a model
 * @param {*} modelName Name of the model
 * @returns 
 */
export async function selectModel(modelName) {
    const params = {
        name: modelName
    }
    
    return axios.get('/model', {params})
            .then((response) => {

                return JSON.parse(response.data)
            })
            .catch(function(err) {
                //not consistent with previous requests, where the error is catched
                //here error is propagated to the GridPlane
                throw err
            })
            .finally(function() {
                //
            })
}


