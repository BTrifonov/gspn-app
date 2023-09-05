import {defineStore} from 'pinia'

/**
 *
 */
export const usePlaneStore = defineStore('plane', {
    state: () => ({
        editPlaneEnabled: false,
        paperGrid: '',
        paperGridSize: 0, 
        paperScale: 1,
        triggerDelete: false, 
        triggerSave: false
    })
})