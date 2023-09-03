import * as joint from 'jointjs'

/**TODO: Discuss with Michel whether this class is needed */
export class Arc extends joint.shapes.standard.Link {
    defaults() {
        return {
            ...super.defaults, 
            type: "custom.Arc", 
            /*attrs: {
                cardinality: {
                    fill: 'black', // default text color
                    fontSize: 10,
                    textAnchor: 'middle',
                    yAlignment: 'middle',
                    pointerEvents: 'none'
                }
            },
            markup: [
                {
                    tagName: 'text', 
                    selector: 'cardinality'
                }
            ]*/
        }
    }
}