import {defineStore} from 'pinia'
import axios from 'axios'
/**
 * TODO: All stores should provide functions for state manipulations, more performant
 */
export const useModelStore = defineStore('modelStore', {
    state: () => ({
        models: [{name: 'sample-model.json', selected: false}],
        saveTrigger: false, 
        updateTrigger: false,
        selectedModelJSON: null
    }),
    getters: {
        getModels: (state) => state.models
    }, 
    actions: {
        triggerSave() {
            this.saveTrigger = true
        },
        disableSaveTrigger() {
            this.saveTrigger = false
        },
        triggerUpdate() {
            this.updateTrigger = true
        },
        disableUpdateTrigger() {
            this.updateTrigger = false
        },
        saveModel(modelName, modelJSON) {
            const data = {
                model: modelJSON
            }

            const params = {
                name: modelName
            }

            axios.post('/model/plainJSON', { data, params })
                    .then(function(response) {
                        console.log("Saved successfully model: " + modelName)
                        return true
                    })
                    .catch(function (err) {
                        console.log("The following error occured:" + err)
                        return false
                    })  
                    .finally(function() {
                        
                    })


            this.models.push({name: modelName, selected: false})
        },
        updateModel(modelName, modelJSON) {
            const data = {
                model: modelJSON
            }

            const params = {
                name: modelName
            }

            axios.put('/model/plainJSON', { data, params })
                    .then(function(response) {
                        console.log("Saved successfully model: " + modelName)
                    })
                    .catch(function (err) {
                        console.log("The following error occured:" + err)
                    })  
                    .finally(function() {
                        //
                    })

        },
        deleteModel(model) {
            const indexElem = this.models.indexOf(model)
            if(indexElem != -1) {
                this.models.splice(indexElem, 1)
            }
        },

        selectModel(model) {
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
            
            return true
        }, 
        unselectModel(model) {
            if(!this.models.includes(model))
                throw new Error("Cannot unselect model, which has not been previously stored")

            model.selected = false
        
            return true  
        }
    }
})
