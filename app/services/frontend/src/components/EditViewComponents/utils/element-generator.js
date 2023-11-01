import * as joint from 'jointjs'

import { Place } from '@/components/EditViewComponents/utils/place.js'
import {Transition} from '@/components/EditViewComponents/utils/transition.js'

/**
 * Create a visual representation of a PN place
 * @returns custom.Place
 */
export function drawPlace(placeIndex) {
    const place = new Place({
        attrs: {
            label: { 
                text: 'P' + placeIndex 
            },
            tokenNumber: { 
                text: '0' 
            },
        },
    });

    //Add ports to the place
    for(let i = 0; i < 9; i++) {
        place.addPort({group: 'radialPort'})
    }
    
    return place
}

/**
 * Create a visual representation of a PN timed transition
 * @returns custom.Transition
 */
export function drawTransition(transitionIndex) {
    const transition = new Transition({
        attrs: {
            label: {
                text: 'T' + transitionIndex
            }, 
            lambda: {
                text: 'λ=7'
            }
        }
    })

    //Indicate it is a timed transition
    transition.prop('timed', true)

    //Set initial time properties of the transition
    transition.prop('tokenDistribution', 'exponential')
    transition.prop('rate', 7)


    addPorts(transition)
    
    return transition
}

/**
 * Create a visual representation of a PN immediate transition
 * @returns custom.Transition
 */
export function drawImmediateTransition(transitionIndex) {
    const transition = new Transition({
       attrs: {
            label: {
                text: 'T' + transitionIndex
            }, 
            lambda: {
                text: 'λ=0'
            }
        }
    })

    transition.prop('attrs/body/fill', 'black')

    //Indicate it is not a timed transition
    transition.prop('timed', false)

    transition.prop('attrs/body/fill', 'black')

    //Add ports to the transition
    addPorts(transition)
    
    return transition
}

/**
 * Create a visual representation of a PN arc
 * @returns Link
 */
export function drawArc(arcIndex) {
    const arc = new joint.shapes.standard.Link()

    arc.prop('arcWeight', 1)
    //TODO: Create a seperate class extending the joint.standard.shapes.Link
    arc.labels([{
        attrs: {
            text: {
                text: "1" 
            }
        }
    }]);

    arc.source(new joint.g.Point(50, 50));
    arc.target(new joint.g.Point(100, 100));
    return arc
}

//----------------------------------------------------------
//Helper methods
//----------------------------------------------------------

/**
 * Add ports, enabling the connection of PN transitions
 * @param {*} transition 
 */
function addPorts(transition) {
    transition.addPort({group: 'bottomPort'})
    transition.addPort({group: 'topPort'})

    transition.addPort({group: 'leftPort'})
    transition.addPort({group: 'rightPort'})

    transition.addPort({group: 'leftBottomCornerPort'})
    transition.addPort({group: 'leftUpperCornerPort'})

    transition.addPort({group: 'rightBottomCornerPort'})
    transition.addPort({group: 'rightUpperCornerPort'})
}
