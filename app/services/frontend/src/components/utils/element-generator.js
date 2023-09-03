import * as joint from 'jointjs'

import { Place } from './CustomElements/place'
import { Transition } from './CustomElements/transition'
import { Arc } from './CustomElements/arc'


/**Create a visual representation for a PN place */
export function drawPlace() {
    const place = new Place({
        position: { x: 100, y: 100 },
        size: { width: 50, height: 50 },
        attrs: {
            label: { 
                text: 'My Place' 
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
    
    return place;
}

export function drawTransition() {
    const transition = new Transition({
        position: {x: 100, y: 100}, 
        size: {width: 25, height: 50}, 
        attrs: {
            label: {
                text: 'My transition'
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

    return transition
}

export function drawImmediateTransition() {
    const transition = drawTransition()
    transition.prop('attrs/body/fill', 'black')
    return transition
}

export function drawArc() {
    const arc = new Arc()
    arc.source(new joint.g.Point(50, 50));
    arc.target(new joint.g.Point(100, 100));
    return arc
}
