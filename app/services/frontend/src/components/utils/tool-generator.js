import * as joint from 'jointjs'


/**
 * Responsible for the creation of element and link tools
 */
export function createElementToolView() {
    const boundaryTool = new joint.elementTools.Boundary()
    //const removeTool = new joint.elementTools.Remove()
    
    const toolView = new joint.dia.ToolsView({
        tools: [
            boundaryTool
        ]
    })

    return toolView
}

export function createLinkToolView() {
    const verticesTool = new joint.linkTools.Vertices()

    const targetArrowheadTool = new joint.linkTools.TargetArrowhead()
    const targetAnchorTool = new joint.linkTools.TargetAnchor()
    
    const sourceAnchorTool = new joint.linkTools.SourceAnchor()
    const sourceArrowheadTool = new joint.linkTools.SourceArrowhead()
    
    const boundaryTool = new joint.linkTools.Boundary();
    const removeTool = new joint.linkTools.Remove();
    
    const toolView = new joint.dia.ToolsView({
        tools: [verticesTool,
                targetArrowheadTool,
                targetAnchorTool,
                sourceArrowheadTool,
                sourceAnchorTool,
                boundaryTool, 
                removeTool],
    })

    return toolView
}