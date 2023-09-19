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
 * Create a visual representation of a PN timed transition
 * @returns custom.Transition
 */
export function drawTransition() {
    const transition = new Transition({
        attrs: {
            label: {
                text: 'T' + transitionIndex
            }
        }
    })

    //Indicate it is a timed transition
    transition.prop('timed', true)

    //Set initial time properties of the transition
    transition.prop('tokenDistribution', 'exponential')
    transition.prop('rate', 7)


    addPorts(transition)
    //Add ports to the transition
    /*transition.addPort({group: 'bottomPort'})
    transition.addPort({group: 'topPort'})

    transition.addPort({group: 'leftPort'})
    transition.addPort({group: 'rightPort'})

    transition.addPort({group: 'leftBottomCornerPort'})
    transition.addPort({group: 'leftUpperCornerPort'})

    transition.addPort({group: 'rightBottomCornerPort'})
    transition.addPort({group: 'rightUpperCornerPort'})
    */
    
    transitionIndex+=1

    return transition
}

/**
 * Create a visual representation of a PN immediate transition
 * @returns custom.Transition
 */
export function drawImmediateTransition() {
    const transition = new Transition({
        attrs: {
            label: {
                text: 'T' + transitionIndex
            }
        }
    })

    transition.prop('attrs/body/fill', 'black')

    //Indicate it is not a timed transition
    transition.prop('timed', false)

    transition.prop('attrs/body/fill', 'black')


    //Add ports to the transition
    addPorts(transition)
    /*transition.addPort({group: 'bottomPort'})
    transition.addPort({group: 'topPort'})

    transition.addPort({group: 'leftPort'})
    transition.addPort({group: 'rightPort'})

    transition.addPort({group: 'leftBottomCornerPort'})
    transition.addPort({group: 'leftUpperCornerPort'})

    transition.addPort({group: 'rightBottomCornerPort'})
    transition.addPort({group: 'rightUpperCornerPort'})*/

    transitionIndex+=1

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
