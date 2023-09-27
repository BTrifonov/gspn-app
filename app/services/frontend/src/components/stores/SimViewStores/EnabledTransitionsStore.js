import {defineStore} from 'pinia'

/**
 * 
 */
export const useEnabledTransitionsStore = defineStore('enabledTransitions', {
    state: () => ({
        enabledTransitions: [],
        modelName: ""
    }), 
    getters: {
        getEnabledTransitions: (state) => state.enabledTransitions,
        getModelName: (state) => state.modelName
    },
    actions: {
        selectModel(modelName) {
            this.modelName = modelName
        },
        setEnabledTransitions(enabledTransitions) {
            this.enabledTransitions = enabledTransitions
        },
        findEnabledTransitions() {
            
        },
        fireTransition(transition) {
            //
        }
    }
})