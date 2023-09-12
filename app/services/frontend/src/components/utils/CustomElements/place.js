import * as joint from 'jointjs'
import { placePort } from '../Ports/placePort'

/**TODO: Add more attributes as needed */
/**TODO: Improve label positioning */
export class Place extends joint.shapes.standard.Circle {
    defaults() {
        return {
            ...super.defaults, 
            type: "custom.Place",
            position: { x: 200, y: 200 },
            size: { width: 60, height: 60 },
            attrs: {
                root: {
                    magnet: false
                },
                body: {
                    cx: 25, 
                    cy: 25,
                    r: 25,
                    strokeWidth: 2, 
                    stroke: 'black', 
                    fill: 'grey'
                }, 
                label: {
                    textVerticalAnchor: 'middle', 
                    textAnchor: 'middle',
                    x: 25, 
                    y: 60,
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