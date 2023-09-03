export const placePort = {
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


