import * as joint from 'jointjs'
import { bottomPort, leftBottomCornerPort, leftPort, leftUpperCornerPort, rightBottomCornerPort, rightPort, rightUpperCornerPort, topPort } from '../Ports/transitionPort'

/**TODO: Decide which attributes should be visible */
export class Transition extends joint.shapes.standard.Rectangle {
    defaults() {
        return {
            ...super.defaults,
            type: 'custom.Transition',
            /*tokenDistribution: 'exponential', 
            rate: 7,*/
            position: {
                x: 200, 
                y: 200
            },
            size: {
                width: 30, 
                height: 70
            },
            attrs: {
                root: {
                    magnet: false
                },
                body: {
                   height: 'calc(h-10)', 
                   width: 'calc(w)', 
                   strokeWidth: 2, 
                   stroke: 'black', 
                   fill: 'grey'
                }, 
                label: {
                    textVerticalAnchor: 'middle', 
                    textAnchor: 'middle', 
                    x: 'calc(w/2)', 
                    y: 'calc(h)',
                    fontSize: 10, 
                    fill: 'black'
                },  
                /*tokenDistribution: {
                    display: 'none',
                    
                    distribition: 'exponential',
                    rate: 0 //default distribution type 
                }, 
                rateLabel: {
                    textVerticalAnchor: 'middle', 
                    textAnchor: 'middle', 
                    x: 'calc(w/2)', 
                    y: 0, 
                    fontSize: 10, 
                    fill: 'black'
                }*/
            },
            markup: [{
                tagName: 'rect',
                selector: 'body',
            }, {
                tagName: 'text',
                selector: 'label'
            }],
            ports: {
                groups: {
                    'leftPort': leftPort,
                    'rightPort': rightPort,
                    'topPort': topPort,
                    'bottomPort': bottomPort,

                    'leftUpperCornerPort': leftUpperCornerPort,
                    'leftBottomCornerPort': leftBottomCornerPort,

                    'rightUpperCornerPort': rightUpperCornerPort,
                    'rightBottomCornerPort': rightBottomCornerPort
                }
            }
        }
    }
    
    /* Serialize and deserialize the style inside attrs as well, so that we can reconstruct later */
    toJSON() {
        const json = super.toJSON()

        // Include the attrs.body in the JSON object
        json.attrs = this.get('attrs')
        
        return json
    }

    /*Currently not needed */
//    fromJSON(json) {
//       this.attr('attrs', json.attrs);
//       super.fromJSON(json);
//    }
}