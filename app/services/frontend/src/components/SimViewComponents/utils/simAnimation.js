import * as joint from 'jointjs'

/**
 * Fire visually the transition on the graph, after the backend has returned the new markings
 * of input and output places
 * @param {*} inputPlaces {id, tokens} of all input places after the transition firing
 * @param {*} outputPlaces {id, tokens} of all output places after the transition firing
 * @param {*} transitionId Id of the transition, which has fired
 */
export async function transitionFiringAnimation(inputPlaces, outputPlaces, transitionId, graph, paper, speedFactor) {
    const inputPlacesViews = []
    inputPlaces.forEach((inputPlace)=>{
        const cell = graph.getCell(inputPlace.id)
        const cellView = paper.findViewByModel(cell)

        inputPlacesViews.push(cellView)
        cellView.highlight()
        cell.attr('tokenNumber/text', inputPlace.tokens)

        const oldInputPlaceCounter = cell.prop('inputPlaceCounter')
        cell.prop('inputPlaceCounter', oldInputPlaceCounter+1)
    })

    await sleep(500 / speedFactor)
    inputPlacesViews.forEach((view) => view.unhighlight())

  
    transitionId.forEach((transition)=>{
        const cell = graph.getCell(transition)
        const cellView = paper.findViewByModel(cell)
        cellView.highlight()
    })
    
    await sleep(500 / speedFactor)
    
    transitionId.forEach((transition)=>{
        const cell = graph.getCell(transition)
        const cellView = paper.findViewByModel(cell)
        cellView.unhighlight()
    })


    const outputPlacesViews = []
    outputPlaces.forEach((outputPlace) => {
        const cell = graph.getCell(outputPlace.id)
        const cellView = paper.findViewByModel(cell)

        outputPlacesViews.push(cellView)
        cellView.highlight()
        cell.attr('tokenNumber/text', outputPlace.tokens)

        const oldOutputPlaceCounter = cell.prop('outputPlaceCounter')
        cell.prop('outputPlaceCounter', oldOutputPlaceCounter+1)
    })
  
    await sleep(500 / speedFactor)
    outputPlacesViews.forEach((view) => view.unhighlight())
}

/**
 * Alternate transition firing visualisation, suitable for automatic simulation, when more than one transition
 * can fire simultaneously
 * @param {*} inputPlaces  
 * @param {*} outputPlaces 
 * @param {*} transitions 
 * @param {*} graph 
 * @param {*} paper 
 */
export async function transitionFiringAnimationAlternate(inputPlaces, outputPlaces, transitions, graph, paper) {
    inputPlaces.forEach((inputPlace)=>{
        const cell = graph.getCell(inputPlace.id)
        const cellView = paper.findViewByModel(cell)

      
        cellView.highlight()
        cell.attr('tokenNumber/text', inputPlace.tokens)

    })

    transitions.forEach((transition)=>{
        const cell = graph.getCell(transition)
        const cellView = paper.findViewByModel(cell)
        cellView.highlight()
    })
    
    outputPlaces.forEach((outputPlace) => {
        const cell = graph.getCell(outputPlace.id)
        const cellView = paper.findViewByModel(cell)
        cellView.highlight()
        cell.attr('tokenNumber/text', outputPlace.tokens)

    })    


    await sleep(1000)

    inputPlaces.forEach((inputPlace)=>{
        const cell = graph.getCell(inputPlace.id)
        const cellView = paper.findViewByModel(cell)
        cellView.unhighlight()
    })

  
    transitions.forEach((transition)=>{
        const cell = graph.getCell(transition)
        const cellView = paper.findViewByModel(cell)
        cellView.unhighlight()
    })
    
    outputPlaces.forEach((outputPlace) => {
        const cell = graph.getCell(outputPlace.id)
        const cellView = paper.findViewByModel(cell)
        cellView.unhighlight()
    }) 

    await sleep(500)
}

/**
 * Pause the JS lifecycle for 'ms' milliseconds
 * @param {*} ms 
 * @returns 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}