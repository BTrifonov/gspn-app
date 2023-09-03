import * as joint from 'jointjs'
import { placePort } from '../Ports/placePort'

/**TODO: Add more attributes as needed */
/**TODO: Improve label positioning */
export class Place extends joint.shapes.standard.Circle {
    defaults() {
        return {
            ...super.defaults, 
            type: "custom.Place", 
            attrs: {
                root: {
                    magnet: false
                },
                body: {
                    cx: 'calc(w/2)',
                    cy: 'calc(h/2)',
                    r: 'calc(h/2)',
                    strokeWidth: 2, 
                    stroke: 'black', 
                    fill: 'grey'
                }, 
                label: {
                    textVerticalAnchor: 'middle', 
                    textAnchor: 'middle', 
                    x: 0, 
                    y: 'calc(h)',
                    fontSize: 10, 
                    fill: 'black'
                }, 
                tokenNumber: {
                    textVerticalAnchor: 'middle', 
                    textAnchor: 'middle', 
                    x: 'calc(w/2)',
                    y: 'calc(h/2)',
                    fontSize:10, 
                    fill: 'black'
                } 
            },
            markup: [
                {
                    tagName: 'circle', 
                    selector: 'body'
                }, 
                {
                    tagName: 'text', 
                    selector: 'label'
                }, 
                {
                    tagName: 'text', 
                    selector: 'tokenNumber'
                }
            ],
            ports: {
                groups: {
                    'radialPort': placePort
                }
            }
        }
    }
}