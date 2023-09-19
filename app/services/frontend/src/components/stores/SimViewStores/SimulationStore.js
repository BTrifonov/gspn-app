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

        isPlaceSelected: false,
        selectedPlace: null,

        time: null,
        hours: 0,
        minutes: 0,
        seconds: 0,
        timerInterval: null,

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
        }
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

          //Should initiate finding new enabled transitions, so that is menu is updated accordingly
          this.findEnabledTransitions()
        },
        startTimer() {
            //at the beginning 0's should be appended
            this.time = "0" + this.hours + ":" + "0" + this.minutes + ":" + "0" + this.seconds

            this.timerInterval = setInterval(() => {
                this.updateTimer()
            }, 1000)
        },
        updateTimer() {
            this.seconds += 1
            if(this.seconds == 60) {
                this.minutes+=1
                this.seconds = 0
            }

            if(this.minutes == 60) {
                this.hours +=1
                this.minutes = 0
            }

            let newTime = ""
            
            if(this.hours < 10) {
                newTime = newTime.concat("0" + this.hours)
            } else {
                newTime = newTime.concat(this.hours)
            }

            newTime = newTime.concat(":")

            if(this.minutes < 10) {
                newTime = newTime.concat("0" + this.minutes)
            } else {
                newTime = newTime.concat(this.minutes)
            }

            newTime = newTime.concat(":")

            if(this.seconds < 10) {
                newTime = newTime.concat("0" + this.seconds)
            } else {
                newTime = newTime.concat(this.seconds)
            }

            console.log(newTime)
            this.time = newTime
        },
        resetTimer() {
            this.hours = 0
            this.minutes = 0
            this.seconds = 0
            this.time = "0" + this.hours + ":" + "0" + this.minutes + ":" + "0" + this.seconds
            clearInterval(this.timerInterval)
            this.timerInterval = null
        },
        stopTimer() {
            clearInterval(this.timerInterval)
            this.timerInterval = null
        }, 
        resumeTimer() {
            this.timerInterval = setInterval(() => {
                this.updateTimer()
            }, 1000)
           
        },

        resetAllActions() {
            this.startSim = false
            this.stopSim = false
            this.rewindToStart = false
            this.rewindToEnd  = false
            this.resetTimer()
        }
    }
})