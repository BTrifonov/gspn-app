import {defineStore} from 'pinia'

export const useTriggerStore = defineStore('triggerElements', {
    state: () => ({
        placeTrigger: false, 
        transitionTrigger: false, 
        immediateTransitionTrigger: false,
        deleteTrigger: false, 
        connectTrigger: false
    })
} )
