import * as joint from 'jointjs'

/**TODO: Discuss with Michel whether this class is needed */
/**Currently not used, problems rendering it to the sim view */
export class Arc extends joint.shapes.standard.Link {
    defaults() {
        return {
            ...super.defaults, 
            type: "custom.Arc", 
            attrs: {
                line: {
                    connection: true, 
                    stroke: "black",
                    strokeWidth: 2, 
                    strokeLinejoin: 'round',
                    targetMarker: {
                        'type': 'path',
                        'd': 'M 10 -5 0 0 10 5 z'
                    }
                },
                wrapper: {
                    connection: true,
                    strokeWidth: 10,
                    strokeLinejoin: 'round'
                }
            },
            markup: [{
                tagName: 'path',
                selector: 'wrapper',
                attributes: {
                    'fill': 'none',
                    'cursor': 'pointer',
                    'stroke': 'transparent'
                }
            }, {
                tagName: 'path',
                selector: 'line',
                attributes: {
                    'fill': 'none',
                    'pointer-events': 'none'
                }
            }] 
        }
    }


    toJSON() {
        const json = super.toJSON()

        json.attrs = this.get('attrs')
        return json
    }
}