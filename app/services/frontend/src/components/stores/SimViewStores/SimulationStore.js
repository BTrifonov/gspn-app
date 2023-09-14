import {defineStore} from 'pinia'

/**
 * 
 */
export const useSimulationStore = defineStore('simStore', {
    state: () => ({
        models: [],
        firedTransition: false,
        
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
        findEnabledTransitions() {
            console.log("Find enabled transition initiated")
            
        },
        setEnabledTransitions(enabledTransitions) {
            this.enabledTransitions = enabledTransitions
        },
        fireTransition(transition) {
          //Serves as notifier for the SimGridPlane to send POST req to backend
        }
    }
})