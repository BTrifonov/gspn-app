import {defineStore} from 'pinia'

/**
 * The user should be able to edit only one element at a time, thus 
 * At any given moment at most one of the variables is different than null
 */
export const useElementStore = defineStore('selectElements', {
    state: () => ({
        selectedPlace: false, 
        selectedTransition: false, 
        selectedArc: false, 
        selectedElement: null
    }),
    getters: {
        //----------------------------------------
        //Place getters
        //----------------------------------------
        getPlaceLabel: (state) => {
            if(state.selectedPlace)
                return state.selectedElement.attr('label/text')
        },
        getPlaceTokens: (state) => {
            if(state.selectedPlace)
                return state.selectedElement.attr('tokenNumber/text')
        }, 
        //----------------------------------------
        //Transition getters
        //----------------------------------------
        getTransitionLabel: (state) => {
            if(state.selectedTransition)
                return state.selectedElement.attr('label/text')
        },
        getTransitionDistribution: (state) => {
            if(state.selectedTransition)
                return state.selectedElement.prop('tokenDistribution')
        },
        getTransitionDistributionRate: (state) => {
            if(state.selectedTransition)
                return state.selectedElement.prop('rate')
        },
        getTransitionIsTimed: (state) => {
            if(state.selectedTransition)
                return state.selectedElement.prop('timed')
        },
        //----------------------------------------
        //Arc getters
        //----------------------------------------
        getArcLabel: (state) => {
            if(state.selectedArc)
                return state.selectedElement.attr('label/text')
        },
        getArcWeight: (state) => {
            if(state.selectedArc) 
                return state.selectedElement.prop('arcWeight')
        }
    },
    actions: {
        //----------------------------------------
        //Functions, related to the whole state
        //----------------------------------------
        unselectAll() {
            this.selectedPlace = false
            this.selectedTransition = false
            this.selectedArc = false

            this.selectedElement = null
        },
        //----------------------------------------
        //Place specific functions
        //----------------------------------------
        selectPlace(place) {
            this.selectedTransition = false
            this.selectedArc = false

            this.selectedPlace = true
            this.selectedElement = place
        },
        unselectPlace() {
            if(this.selectedPlace) {
                this.selectedPlace = false
                this.selectedElement = null
            } else {
                console.error("Cannot unselect a place, if a place has not been selected before")
            }
        },
        setPlaceTokenNumber(tokens) {
            //Primary function is to pass tokenNumber from EditPlaceMenu to EditGridPlane
            if(this.selectedPlace) {
                this.selectedElement.attr('tokenNumber/text', tokens)
            } else {
                console.error("Cannot set place tokens, if a place has not been selected")
            }
        }, 
        setPlaceLabel(label) {
            //Primary function is to pass label from EditPlaceMenu to EditGridPlane
            if(this.selectedPlace) {
                this.selectedElement.attr('label/text', label)
            } else {
                console.error("Cannot set place label, if a place has not been selected")
            }
        }, 
        deletePlace() {
            if(this.selectedPlace) {
                this.selectedPlace = false
                
                this.selectedElement.remove()
                
                this.selectedElement = null
            } else {
                console.error("Cannot delete a place, if a place has not been selected")
            }
        },
        //---------------------------------------
        //Transition specific functions
        //---------------------------------------
        selectTransition(transition) {
            this.selectedPlace = false
            this.selectedArc = false
            
            this.selectedTransition = true
            this.selectedElement = transition
        },
        unselectTransition() {
            if(this.selectedTransition) {
                this.selectedTransition = false
                this.selectedElement = null
            } else {
                console.error("Cannot unselect a transition, if a transition has not been selected before")
            }
        },
        setTransitionLabel(label) {
            if(this.selectedTransition) {
                this.selectedElement.attr('label/text', label)
            } else {
                console.error("Cannot set transition label, if a transition has not been selected")
            }
        },
        setTransitionDistribution(distribution) {
            if(this.selectedTransition) {
                this.selectedElement.prop('tokenDistribution', distribution)
            } else {
                console.error("Cannot set transition distribution, if a transition has not been selected")
            }
        }, 
        setTransitionRate(rate) {
            if(this.selectedTransition) {
                this.selectedElement.prop('rate', rate)
                this.selectedElement.attr('lambda/text', 'λ=' + rate)
            } else {
                console.error("Cannot set transition rate, if a transition has not been selected")
            }

        },
        deleteTransition() {
            if(this.selectedTransition) {
                this.selectedElement.remove()
                
                this.selectedTransition = false
                this.selectedElement = null
            } else {
                console.error("Cannot delete a transition, if a transition has not been selected")
            }
        },
        //------------------------------------------
        //Arc specific functions
        //TODO: Should be possible to set e.g label
        //------------------------------------------
        selectArc(arc) {
            this.selectedPlace = false
            this.selectedTransition = false

            this.selectedArc = true
            this.selectedElement = arc
        }, 
        unselectArc() {
            if(this.selectedArc) {
                this.selectedArc = false
                this.selectedElement = null
            } else {
                console.error("Cannot unselect an arc, if an arc has not been selected")
            }
        },
        setArcWeight(weight) {
            if(this.selectedArc) {
                this.selectedElement.prop('arcWeight', weight)
                
                this.selectedElement.labels([{
                    attrs: {
                        text: {
                            text: "" + weight
                        }
                    }
                }]);

                this.selectedElement.prop('attrs/label/text', '' + weight);
            } else {
                console.error("Cannot set arc weight if arc has not been selected")
            }
        },
        deleteArc() {
            if(this.selectedArc) {
                this.selectedElement.remove()

                this.selectedArc = false
                this.selectedElement = null
            } else {
                console.error("Cannot delete an arc, if an arc has not been selected")
            }
        }
    }
})