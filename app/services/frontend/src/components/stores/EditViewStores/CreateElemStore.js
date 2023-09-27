import {defineStore} from 'pinia'

export const useCreateElemStore = defineStore('createElemStore', {
    state: () => ({
        placeButton: false, 
        transitionButton: false, 
        immediateTransitionButton: false, 
        arcButton: false
    }),
    getters: {
        getPlaceButton: (state) => state.placeTrigger,
        getTransitionButton: (state) => state.transitionButton,
        getImmediateTransitionButton: (state) => state.immediateTransitionButton,
        getArcButton: (state) => state.arcButton
    },
    actions: {
        setPlaceButton(value) {
            this.placeButton = value
        },
        setTransitionButton(value) {
            this.transitionButton = value
        },
        setImmediateTransitionButton(value) {
            this.immediateTransitionButton = value
        },
        setArcButton(value) {
            this.arcButton = value
        }
    }
})
