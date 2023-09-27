import {defineStore} from 'pinia'

/**
 * Store, responsible for transferring user input from the EditPlaneMenu to the GridPlane
 * The paper in GridPlane should be adjusted to the user input
 */
export const usePlaneStore = defineStore('plane', {
    state: () => ({
        editPlaneEnabled: false,
        paperGrid: '',
        paperGridSize: 0, 
        paperScale: 1
    })
})