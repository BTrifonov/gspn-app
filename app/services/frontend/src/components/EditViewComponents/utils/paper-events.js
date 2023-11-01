import { createLinkToolView, createLinkToolViewEdit, createElementToolView } from '@/components/EditViewComponents/utils/tool-generator.js';

//------------------------------------------
// Validate link connection event
// TODO: Here could be placed more restrictions
// For now we prohibit connection place<->place
// or transition<->transition
//------------------------------------------
export function validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    const cellSource = cellViewS.model
    const cellTarget = cellViewT.model

    //Allow connection Place->Transition
    if(cellSource.attributes.type === "custom.Place" && cellTarget.attributes.type === "custom.Transition") return true
    
    //Allow connection Transition->Place
    if(cellSource.attributes.type === "custom.Transition" && cellTarget.attributes.type === "custom.Place") return true

    //Everything else by default is forbidden, whitelisting approach
    return false
}

//------------------------------------------
// Cell events (Element and Link)
//------------------------------------------
/**
 * Select an element or a link, enables the user to change attributes of the element/link
 * @param {*} paper Visual representation of the model
 * @param {*} editElementStore Store responsible for element data transfer between GridPlane and EditElemMenu
 * @param {*} cellView Visual representation of the element/link
 */
export function selectCell(paper, editElementStore, cellView) {
    const cell = cellView.model
    const modelId = cell.id

    const prevSelectedElement = editElementStore.selectedElement
    let prevElementNotUnselected = false

    if(prevSelectedElement != null) {
        const prevSelectedElementId = prevSelectedElement.id
        const prevSelectedElementView = paper.findViewByModel(prevSelectedElement)

        prevSelectedElementView.removeTools()
        editElementStore.unselectAll()

        //Previous element has not been unselected
        //However user selects new element
        if(modelId != prevSelectedElementId) 
            prevElementNotUnselected = true
    }

    //There has been no selected element or
    //Previous selected element is not the same
    if(prevSelectedElement == null || prevElementNotUnselected) {
        if(cell.attributes.type === 'custom.Place') {
            cellView.addTools(createElementToolView())
            editElementStore.selectPlace(cell)
        } else if(cell.attributes.type === 'custom.Transition') {
            cellView.addTools(createElementToolView())
            editElementStore.selectTransition(cell)
        } else if(cell.attributes.type === 'standard.Link') {
            cellView.addTools(createLinkToolView())
            editElementStore.selectArc(cell)
        }
    }
}

//------------------------------------------
//Link events
//------------------------------------------
/**
 * Attach link tools to the link view
 * Tools enable user actions on the link, e.g moving and setting anchor points
 * @param {*} linkView 
 */
export function attachLinkTools(linkView) {
    if(!linkView.hasTools()) {
        const linkToolView = createLinkToolViewEdit()
        linkView.addTools(linkToolView) 
    } else {
        linkView.removeTools()
    }
}

//------------------------------------------
//Element events
//------------------------------------------
/**
 * Show the linking ports of an element on element mouseenter event
 * @param {*} elementView Visual representation of the element
 */
export function showLinkPorts(elementView) {
    const element = elementView.model
    const ports = element.getPorts()

    for(const port of ports) {
        const portId = port.id
        element.portProp(portId, 'attrs/body/visibility', 'visible')
    }
}

/**
 * Hide the linking ports of an element on element mouseleave event
 * @param {*} elementView Visual representation of the element
 */
export function hideLinkPorts(elementView) {
    const element = elementView.model
    const ports = element.getPorts()

    for(const port of ports) {
        const portId = port.id
        element.portProp(portId, 'attrs/body/visibility', 'hidden')
    }
}

//------------------------------------------
//Blank paper and resizing events
//------------------------------------------
/**
 * Unselect all elements on the paper, which includes:
 *      1. Removing the element tools of all elements
 *      2. Removing the selected element from the editElementStore
 * 
 * @param {*} paper Visual representation of the model
 * @param {*} editElementStore Store responsible for element data transfer between GridPlane and EditElemMenu
 */
export function unselectAllElements(paper, editElementStore) {
    paper.removeTools()

    editElementStore.unselectAll()
    editElementStore.selectedElement = null
}

/**
 * Enable plane modification, e.g zoom in or out and changing grid type
 * @param {*} planeStore Store responsible for plane data transfer between GridPlane and EditPlaneMenu
 */
export function selectPaper(planeStore) {
    planeStore.editPlaneEnabled = !planeStore.editPlaneEnabled
}

/**
 * Resize the paper, when the user drags and element outside the visible area
 * @param {*} paper Visual representation of the model
 * @param {*} elementView Visual representation of the element
 */
export function resizePaper(paper, elementView) {
    const elementSize = elementView.getBBox()
    const paperSize = paper.getComputedSize()
        
    /*Increase paper width and translate right, when element dragged to the left outside the paper*/
    if(elementSize.x < 0) {
        const dx = Math.abs(elementSize.x)

        paper.setDimensions(paperSize.width + dx, paperSize.height)
        paper.translate(dx + paper.options.origin.x, 0)
    }

    /*Increase paper width and translate left, element dragged to the right outside the paper*/
    if(elementSize.x + elementSize.width > paperSize.width) {
        const dx = (elementSize.x + elementSize.width) - paperSize.width

        paper.setDimensions(paperSize.width + dx, paperSize.height)
        paper.translate(- dx + paper.options.origin.x, 0)
    }
    
    /*Increase paper height and translate downwards, element dragged to the top outside the paper*/
    if(elementSize.y < 0) {
        const dy = Math.abs(elementSize.y)
        
        paper.setDimensions(paperSize.width, paperSize.height + dy)
        paper.translate(0, dy + paper.options.origin.y)
    }

    /*Increase paper height and translate upwards, element dragged to the bottom outside the paper*/
    if(elementSize.y + elementSize.height > paperSize.height) {
        const dy = (elementSize.y + elementSize.height) - paperSize.height
        
        paper.setDimensions(paperSize.width, paperSize.height + dy)
        paper.translate(0, - dy + paper.options.origin.y)
    }
}

/**
 * Translate the plane on user request
 * @param {*} evt 
 * @param {*} x 
 * @param {*} y 
 * @param {*} paper 
 */
export function translatePaper(evt, x, y, paper) {
    //TODO: The problem is that initially the paper origin is at the top left corner, however should be
    //at the {x: width/2, y: height/2} of the grid plane
    console.log(paper.translate())
    const oldCenterCoord = paper.translate()

    paper.translate(oldCenterCoord.tx + x, oldCenterCoord.ty + y)
}