import * as joint from 'jointjs'
import { placePort } from '../Ports/placePort'

/**TODO: Add more attributes as needed */
/**TODO: Improve label positioning */
export class Place extends joint.shapes.standard.Circle {
    defaults() {
        return {
            ...super.defaults, 
            type: "custom.Place",
            tokenNumber: 5,
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
                    x: 'calc(w/2)', 
                    y: 'calc(h+5)',
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

    toJSON() {
        const json = super.toJSON()

        json.attrs = this.get('attrs')

        return json
    }

    /*Currenty not used */
//    fromJSON() {
//
//    }
}