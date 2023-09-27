import { createLinkToolView } from '@/components/utils/tool-generator.js';
import { createElementToolView } from '@/components/utils/tool-generator.js';


//------------------------------------------
//Link events
//------------------------------------------

/**
 * Attach link tools to the link view
 * Tools enable user actions on the link, e.g moving and setting anchor points
 * @param {*} linkView Visual representation of a link
 */
export function attachLinkToolsOnMouseEnter(linkView) {
    const linkToolView = createLinkToolView()
    linkView.addTools(linkToolView)   
}

/**
 * Detach all link tools from the link view
 * @param {*} linkView Visual representation of a link
 */
export function detachLinkToolsOnMouseLeave(linkView) {
    linkView.removeTools()
}

//------------------------------------------
//Element events
//------------------------------------------
/**
 * Select an element from the paper, which includes:
 *      1. Attaching element tools to the element
 *      2. Storing the selected element in the editElementStore
 *         2.1 Used for user manipulation of element attributes in EditElemMenu.vue
 * 
 * Method is used also for unselecting element, which includes:
 *      1. Detaching element tools
 *      2. Removing the selected element from the editElementStore
 * 
 * @param {*} paper Visual representation of the model
 * @param {*} editElementStore Store responsible for element data transfer between GridPlane and EditElemMenu
 * @param {*} elementView Visual representation of the element
 */
export function selectElement(paper, editElementStore, elementView) {
    const element = elementView.model
    const modelId = element.id

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
        const elementToolView = createElementToolView()
        elementView.addTools(elementToolView)

        if(element.attributes.type === 'custom.Place') {
            editElementStore.selectPlace(element)
        } else if(element.attributes.type === 'custom.Transition') {
            editElementStore.selectTransition(element)
        }
    }
}

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