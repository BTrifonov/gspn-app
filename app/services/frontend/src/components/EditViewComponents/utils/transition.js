import * as joint from 'jointjs'

/**
 * Visual representation of a transition
 */
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
                    fontSize: 12, 
                    fill: 'black'
                },
                lambda: {
                    textVerticalAnchor: 'middle', 
                    textAnchor: 'middle',
                    x: 'calc(w/2)', 
                    y: '-5',
                    fontSize: 12, 
                    fill: 'black'
                }  
            },
            markup: [{
                tagName: 'rect',
                selector: 'body',
            }, {
                tagName: 'text',
                selector: 'label'
            },{
                tagName: 'text', 
                selector: 'lambda'
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
    
    /* Serialize and deserialize the style inside attrs as well, so that we can reconstruct the model with the styling later */
    toJSON() {
        const json = super.toJSON()

        // Include the attrs.body in the JSON object
        json.attrs = this.get('attrs')
        
        return json
    }
}

const leftPort = {
    position: {
        name: 'left',
        args: {
            x: 0, 
            //y: 25,
            y: 'calc(h/2-5)'
        }
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

const rightPort = {
    position: {
        name: 'right',
        args: {
            x: 'calc(w)',
            //x: 25, 
            y: 'calc(h/2-5)'
            //y: 25
        }
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

const topPort = {
    position: {
        name: 'top', 
        args: {}
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

const bottomPort = {
    position: {
        name: 'bottom',
        args: {
            x: 'calc(w/2)',
            y: 'calc(h-10)'
            //x: 12.5,
            //y: 50,
            //dx: 1,
            //dy: 1
        }
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

const leftUpperCornerPort = {
    position: {
        name: 'absolute',
        args: {
            x: 0,
            y: 0
        }
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

const leftBottomCornerPort = {
    position: {
        name: 'absolute',
        args: {
            x: 0,
            y: 'calc(h-10)'
        }
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

const rightUpperCornerPort = {
    position: {
        name: 'absolute',
        args: {
            x: 'calc(w)',
            y: 0
        }
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

const rightBottomCornerPort = {
    position: {
        name: 'absolute',
        args: {
            //x: 25
            x: 'calc(w)',
            //y: 50
            y: 'calc(h-10)'
        }
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