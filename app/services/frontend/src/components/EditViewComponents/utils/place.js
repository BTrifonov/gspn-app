import * as joint from 'jointjs'


/**
 * Visual representation of a place
 */
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
                    cx: 30, 
                    cy: 30,
                    r: 30,
                    strokeWidth: 2, 
                    stroke: 'black', 
                    fill: 'grey'
                }, 
                label: {
                    textVerticalAnchor: 'middle', 
                    textAnchor: 'middle',
                    x: 30, 
                    y: 70,
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
}

const placePort = {
    position: {
        name: 'ellipseSpread',
    args: {
        angle: 0,
        step: 45,
        compensateRotation: false
    },
    }, 
    attrs: {
        body: {
            magnet: true, 
            r: 7,
            fill: 'lightblue',
            stroke: 'blue',
            visibility: 'hidden',
            opacity: 0.6
        }
    },
    markup: [{
        tagName: 'circle', 
        selector: 'body'
    }]
}
