import * as joint from 'jointjs'

import { Place } from './CustomElements/place'
import { Transition } from './CustomElements/transition'

let placeIndex = 0
let transitionIndex = 0
//const arcIndex = 0

/**
 * Create a visual representation of a PN place
 * @returns custom.Place
 */
export function drawPlace() {
    const place = new Place({
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
        attrs: {
            label: { 
                text: 'P' + placeIndex 
            },
            tokenNumber: { 
                text: '5' 
            },
        },
    });

    //Add ports to the place
    for(let i = 0; i < 9; i++) {
        place.addPort({group: 'radialPort'})
    }
    
    placeIndex+=1

    return place
}

/**
 * Create a visual representation of a PN transition
 * @returns custom.Transition
 */
export function drawTransition() {
    const transition = new Transition({
        attrs: {
            label: {
                text: 'T' + transitionIndex
            },
            tokenDistribution: {
                distribution: 'exponential', 
                rate: 0.75
            }, 
            rateLabel: {
                text: 'λ = 0.75'
            }
        }
    })

    //Add ports to the transition
    transition.addPort({group: 'bottomPort'})
    transition.addPort({group: 'topPort'})

    transition.addPort({group: 'leftPort'})
    transition.addPort({group: 'rightPort'})

    transition.addPort({group: 'leftBottomCornerPort'})
    transition.addPort({group: 'leftUpperCornerPort'})

    transition.addPort({group: 'rightBottomCornerPort'})
    transition.addPort({group: 'rightUpperCornerPort'})

    transitionIndex+=1

    return transition
}

/**
 * Create a visual representation of a PN immediate transition
 * @returns custom.Transition
 */
export function drawImmediateTransition() {
    const transition = drawTransition()
    transition.prop('attrs/body/fill', 'black')
    return transition
}

/**
 * Create a visual representation of a PN arc
 * @returns Link
 */
export function drawArc() {
    const arc = new joint.shapes.standard.Link()
    arc.source(new joint.g.Point(50, 50));
    arc.target(new joint.g.Point(100, 100));
    return arc
}
