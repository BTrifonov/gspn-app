import {defineStore} from 'pinia'
import axios from 'axios'
/**
 * TODO: All stores should provide functions for state manipulations
 */
export const useModelStore = defineStore('modelStore', {
    state: () => ({
        models: [{name: 'sample-model.json', selected: false, transitionCount: 0, placeCount: 0, arcCount: 0}],
        selectedModelJSON: null
    }),
    getters: {
        getModels: (state) => state.models
    }, 
    actions: {
        saveModel(modelName) {
            //check for existing model with this name
            for(const iterModel of this.models) {
                if(modelName === iterModel.name) 
                    throw new Error("Cannot save model with name: " + modelName + " already exists model with this name!")
            }

            this.models.push({name: modelName, selected: false})
            return true
        },
        updateModel(model) {
            //check if model can be found in models
            if(!this.models.includes(model))
                throw new Error("Cannot update model, which has not been previously stored")

            //this function server primarily to notify the EditGridPlane to issue new put request
            return true
        },
        deleteModel(model) {
            const indexElem = this.models.indexOf(model)
            if(indexElem == -1)
                throw new Error("Cannot delete model, which has not been previously stored")

            this.models.splice(indexElem, 1)
            return true
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
        },
        unselectAllModels() {
            for(const iterModel of this.models) {
                iterModel.selected = false
            }
        },
        updateModelElementCount(modelName, transitionCount, placeCount, arcCount) {
            for (const iterModel of this.models) {
                if(iterModel.name === modelName) {
                    iterModel.transitionCount = transitionCount
                    iterModel.placeCount = placeCount
                    iterModel.arcCount = arcCount
                }
            }
        }
    }
})
