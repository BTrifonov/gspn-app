import {defineStore} from 'pinia'

/**
 * The user should be able to edit only one element at a time, thus 
 * At any given moment at most one of the variables is different than null
 */
export const useElementStore = defineStore('selectElements', {
    state: () => ({
        selectedPlace: null, 
        selectedTransition: null, 
        selectedArc: null
    }),
    actions: {
        setPlace(place) {
            this.selectedTransition = null
            this.selectedArc = null
    
            this.selectedPlace = place
        },
        setTransition(transition) {
            this.selectedPlace = null
            this.selectedArc = null
    
            this.selectedTransition = transition
        }, 
        /*setArc(arc) {
            this.selectedPlace = null
            this.selectedTransition = null
    
            this.selectedArc = arc
        },*/ 
        unselectAll() {
            this.selectedPlace = null, 
            this.selectedTransition = null, 
            this.selectedArc = null
        }
    }
})