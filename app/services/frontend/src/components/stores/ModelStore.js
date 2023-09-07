import {defineStore} from 'pinia'

/**
 * TODO: All stores should provide functions for state manipulations, more performant
 */
export const useModelStore = defineStore('modelStore', {
    state: () => ({
        models: [{name: 'sample-model.json', selected: false}]
    }),
    getters: {
        getModels: (state) => state.models
    }, 
    actions: {
        saveModel(model) {
            //The last saved model is automatically the model, on which it is currently working
            this.models.push({name: model, selected: true})
        },
        selectUnselectModel(chosenModel) {
            if(!chosenModel.selected) {
                for (const model of this.models) {
                    if(model != chosenModel) {
                        model.selected = false
                    }
                }
        
                chosenModel.selected = true
            } else {
                chosenModel.selected = false
            }
        },
        deleteModel(model) {
            const indexElem = this.models.indexOf(model)
            if(indexElem != -1) {
                this.models.splice(indexElem, 1)
            }
        }

    }
})
