
/**TODO: Could be implemented with less code, see jointjs doc about port.layout */

export const leftPort = {
    position: {
        name: 'left',
        args: {}
    }, 
    attrs: {
        body: {
            magnet: true, 
            r: 5,
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
        args: {}
    }, 
    attrs: {
        body: {
            magnet: true, 
            r: 5,
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
            r: 5,
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
        args: {}
    }, 
    attrs: {
        body: {
            magnet: true, 
            r: 5,
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
            r: 5,
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
            y: 'calc(h)'
        }
    }, 
    attrs: {
        body: {
            magnet: true, 
            r: 5,
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
            y: '0'
        }
    }, 
    attrs: {
        body: {
            magnet: true, 
            r: 5,
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
            x: 'calc(w)',
            y: 'calc(h)'
        }
    }, 
    attrs: {
        body: {
            magnet: true, 
            r: 5,
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