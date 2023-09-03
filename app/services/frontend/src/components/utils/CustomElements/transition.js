import * as joint from 'jointjs'
import { bottomPort, leftBottomCornerPort, leftPort, leftUpperCornerPort, rightBottomCornerPort, rightPort, rightUpperCornerPort, topPort } from '../Ports/transitionPort'

/**TODO: Decide which attributes should be visible */
export class Transition extends joint.shapes.standard.Rectangle {
    defaults() {
        return {
            ...super.defaults, 
            type: 'custom.Transition',
            attrs: {
                root: {
                    magnet: false
                },
                body: {
                    height: 'calc(h)', 
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
                tokenDistribution: {
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
                }
            },
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
}