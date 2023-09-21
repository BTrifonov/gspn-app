import {defineStore} from 'pinia'

/**
 * 
 */
export const useSimulationStore = defineStore('simStore', {
    state: () => ({
        models: [],
        firedTransition: false,
        
        manualSimulation: false, 
        automaticSimulation: false, 

        startSim: false, 
        stopSim: false, 
        rewindToStart: false, 
        rewindToEnd: false, 
        simSpeed: false,

        simulationTime: 0,

        isPlaceSelected: false,
        selectedPlace: null,

        
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
        isModelSelected: (state) => {
            for(const model of state.models) {
                if(model.selected)
                    return true
            }
            return false
        },
        getEnabledTransitions: (state) => state.enabledTransitions,

        getInputPlaceCount: (state) => {
            if(state.selectedPlace!=null) 
                return state.selectedPlace.prop('inputPlaceCounter')
        }, 
        getOutputPlaceCount: (state) => {
            if(state.selectedPlace!=null) 
                return state.selectedPlace.prop('outputPlaceCounter')
        },
        getAvgTokenPlace: (state) => {
            if(state.selectedPlace!=null)
                return state.selectedPlace.prop('avgTokens')
        },

        getSimulationTime: (state) => state.simulationTime
    }, 
    actions: {
        setModels(models) {
            this.models = models
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

            //reset the time
            this.simulationTime = 0

            //change flag of model to true
            model.selected = true            
        },
        unselectModel(model) {
            if(!this.models.includes(model))
                throw new Error("Cannot unselect model, which has not been previously stored")

            model.selected = false
    
            //choice between manual or automatic simulation should also be reset
            this.manualSimulation = false
            this.automaticSimulation = false

            return true  
        },
        unselectAllModels() {
            for(const iterModel of this.models) {
                iterModel.selected = false
            }

            //choice between manual or automatic simulation should also be reset
            this.manualSimulation = false
            this.automaticSimulation = false
        },
        setManualSimulation() {
            this.automaticSimulation = false
            this.manualSimulation = true
        },
        setAutomaticSimulation() {
            this.manualSimulation = false
            this.automaticSimulation = true
        },
        setSimulationTime(newSimulationTime) {
            this.simulationTime = newSimulationTime
        },
        findEnabledTransitions() {
            console.log("Find enabled transition initiated")
        },
        setEnabledTransitions(enabledTransitions) {
            this.enabledTransitions = enabledTransitions
        },
        fireTransition(transition) {
          //Serves as notifier for the SimGridPlane to send POST req to backend

          //Should initiate finding new enabled transitions, so that is menu is updated accordingly
          this.findEnabledTransitions()
        },
        resetAllButtons() {
            //reset the states of all buttons
            this.startSim = false
            this.stopSim = false
            this.rewindToStart = false
            this.rewindToEnd  = false
        }
    }
})