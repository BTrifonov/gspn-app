import * as joint from 'jointjs'

/**
 * Responsible for the creation of element and link tools
 */
export function createElementToolView() {
    const boundaryTool = new joint.elementTools.Boundary()
    
    const toolView = new joint.dia.ToolsView({
        tools: [
            boundaryTool
        ]
    })

    return toolView
}

export function createLinkToolView() {
    const boundaryTool = new joint.linkTools.Boundary();
    const toolView = new joint.dia.ToolsView({
        tools: [boundaryTool],
    })

    return toolView
}

export function createLinkToolViewEdit() {
    const verticesTool = new joint.linkTools.Vertices()

    const targetArrowheadTool = new joint.linkTools.TargetArrowhead()
    const sourceArrowheadTool = new joint.linkTools.SourceArrowhead()
    const boundaryTool = new joint.linkTools.Boundary();

    const toolView = new joint.dia.ToolsView({
        tools: [verticesTool,
                targetArrowheadTool,
                sourceArrowheadTool,
                boundaryTool, 
            ],
    })

    return toolView
}