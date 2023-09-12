import {defineStore} from 'pinia'

/*
*
*/
export const useSimMenuStore = defineStore('simMenu', {
    state: () => ({
        start: false, 
        stop: false, 
        rewindToStart: false, 
        rewindToEnd: false,
        simSpeed: 0
    }), 
    getters: {
        getStart: (state) => state.start,
        getStop: (state) => state.stop, 
        getRewindToStart: (state) => state.rewindToStart, 
        getRewindToEnd: (state) => state.rewindToEnd,
        getSimSpeed: (state) => state.simSpeed
    },
    actions: {
        startButton() {
            this.start = true
        }, 
        stop() {
            this.stop = true
        }, 
        rewindToStart() {
            this.rewindToStart = true
        },
        rewindToEnd() {
            this.rewindToEnd = true
        },
        setSimSpeed(value) {
            this.simSpeed = value
        }
    }
})