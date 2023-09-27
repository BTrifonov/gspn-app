import {defineStore} from 'modules/pinia'

export const useSimulationStore = defineStore('simStore', {
    state: () => ({
        models: [],
        firedTransition: false,
        
        manualSimulation: false, 
        automaticSimulation: false, 

        simStep: 0,
        enteredSimStep: false,
        withTimeStep: false,
        withoutTimeStep: false, 

        startSim: false,
        continueSim: false, 
        stopSim: false, 
        rewindToStart: false, 
        rewindToEnd: false, 
        
        simSpeed: 1,

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
        //-----------------------------------------------
        // Actions related to the store model menu
        //-----------------------------------------------
        /**
         * Set all models
         * A model is represented as {name: "", selected: ""}
         * @param {*} models 
         */
        setModels(models) {
            this.models = models
        },

        /**
         * Set the 'selected' flag of a model to True
         * The 'selected' flags of all other models should be set to False
         * @param {*} model 
         */
        selectModel(model) {
            //unselect all other models
            for(const iterModel of this.models) {
                if(model != iterModel) {
                    iterModel.selected = false
                }
            }

            //hide all simulation menus
            this.hideSimulationMenus()

            //reset the time
            this.simulationTime = 0

            //change flag of model to true
            model.selected = true            
        },

        /**
         * Set the 'selected' flag of a model to False
         * @param {*} model 
         * @returns 
         */
        unselectModel(model) {
            model.selected = false
    
            this.hideSimulationMenus()
        },

        /**
         * Set the 'selected' flag of all models to False
         */
        unselectAllModels() {
            for(const iterModel of this.models) {
                iterModel.selected = false
            }

            this.hideSimulationMenus()
        },

        //-----------------------------------------------
        // Actions related to the SimModeMenu.vue
        //-----------------------------------------------
        setManualSimulation() {
            this.automaticSimulation = false
            this.hideAutoSimMenus()

            this.manualSimulation = true
        },
        setAutomaticSimulation() {
            this.manualSimulation = false
            this.automaticSimulation = true
        },
        handleWithoutTimeStepSim() {
            this.enteredSimStep = false
            this.withTimeStep = false

            this.withoutTimeStep = true
        },
        handleWithTimeStepSim() {
            this.withoutTimeStep = false
            this.withTimeStep = true
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
            //reset the states of all simulation buttons
            this.startSim = false
            this.stopSim = false
            this.rewindToStart = false
            this.rewindToEnd  = false
        },
        hideSimulationMenus() {
            this.automaticSimulation = false
            this.manualSimulation = false

            this.enteredSimStep = false
            this.withTimeStep = false
            this.withoutTimeStep = false

            //All simulation buttons should be reset to their default values
            this.resetAllButtons()
        }, 
        hideAutoSimMenus() {
            this.withTimeStep = false
            this.withoutTimeStep = false
            this.enteredSimStep = false
        }
    }
})