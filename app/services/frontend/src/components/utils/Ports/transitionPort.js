
/**TODO: Could be implemented with less code, see jointjs doc about port.layout */

export const leftPort = {
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

export const rightPort = {
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

export const topPort = {
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

export const bottomPort = {
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

export const leftUpperCornerPort = {
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

export const leftBottomCornerPort = {
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

export const rightUpperCornerPort = {
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

export const rightBottomCornerPort = {
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