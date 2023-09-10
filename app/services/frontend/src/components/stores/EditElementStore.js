import {defineStore} from 'pinia'

/**
 * The user should be able to edit only one element at a time, thus 
 * At any given moment at most one of the variables is different than null
 */
export const useElementStore = defineStore('selectElements', {
    state: () => ({
        selectedPlace: false, 
        selectedTransition: false, 
        selectedArc: false
    }),
    actions: {
        selectPlace() {
            this.selectedTransition = false
            this.selectedArc = false

            this.selectedPlace = true
        }, 
        selectTransition() {
            this.selectedPlace = false
            this.selectedArc = false
            
            this.selectedTransition = true
        },
        selectArc() {
            this.selectedPlace = false
            this.selectedTransition = false

            this.selectedArc = true
        },
        unselectAll() {
            this.selectedPlace = false
            this.selectedTransition = false
            this.selectedArc = false
        },
        //----------------------------------------
        //Place specific functions
        //----------------------------------------
        setPlaceTokenNumber(tokenNumber) {
            //Primary function is to pass tokenNumber from EditPlaceMenu to EditGridPlane
        }, 
        setPlaceLabel(label) {
            //Primary function is to pass label from EditPlaceMenu to EditGridPlane
        }, 
        deletePlace() {
            //
        },
        //---------------------------------------
        //Transition specific functions
        //---------------------------------------
        setTransitionLabel(label) {
            //
        },
        setTransitionDistribution(distribution) {
            //
        }, 
        setTransitionRate(rate) {
            //
        },
        deleteTransition() {
            //
        }
    }
})