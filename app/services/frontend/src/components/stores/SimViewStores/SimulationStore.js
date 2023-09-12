import {defineStore} from 'pinia'
import axios from 'axios'

/**
 * 
 */
export const useSimulationStore = defineStore('simStore', {
    state: () => ({
        models: [],
        
        startSim: false, 
        stopSim: false, 
        rewindToStart: false, 
        rewindToEnd: false, 
        simSpeed: false,

        enabledTransitions: [], 
        tracebackTransitions: []
    }), 
    getters: {
        getModels: (state) => state.models,
        getSelectedModelName: (state) => {
            for(const model of state.models) {
                if(model.selected)
                    return model.name
            }
        },
        getEnabledTransitions: (state) => state.enabledTransitions
    }, 
    actions: {
        setModels(models) {
            this.models = models
        },
        async selectModel(model) {
            if(!this.models.includes(model))
                throw new Error("Cannot unselect model, which has not been previously stored")

            //unselect all other models
            for(const iterModel of this.models) {
                if(model != iterModel) {
                    iterModel.selected = false
                }
            }

            //change flag of model to true
            model.selected = true

            //Fetch the model based on the model.name
            const params = {
                name: model.name
            }
        
            return axios.get('/model', {params})
                            .then(function(response) {
                                console.log("Fetch the model with name: " + model.name)
                                const modelJSON = JSON.parse(response.data)
                                return modelJSON.model
                            })
                            .catch(function(err) {
                                console.log("An error occured" + err)
                            })
                            .finally(function() {
                                //
                            })
        },
        unselectModel(model) {
            if(!this.models.includes(model))
                throw new Error("Cannot unselect model, which has not been previously stored")

            model.selected = false
    
            return true  
        },
        unselectAllModels() {
            for(const iterModel of this.models) {
                iterModel.selected = false
            }
        },
        async findEnabledTransitions() {
            const params = {
                name: this.getSelectedModelName
            }


            return axios.get('/model/enabled-transitions', {params})
                            .then(function(response) {
                                return response.data
                            })
                            .catch(function(error) {
                                return error
                            })

        },
        setEnabledTransitions(enabledTransitions) {
            this.enabledTransitions = enabledTransitions
        },
        async fireTransition(transition) {
            const params = {
                name: this.getSelectedModelName, 
                transition_id: transition.id
            }

            return axios.post('/model/fire-transition', {params})
                    .then(function(response) {
                        return response.data
                        //animateSimulation(response.data.input_places, response.data.output_places, transition.id)
                    })
        }
    }
})