import * as joint from 'jointjs'

/*TODO: Validation function not working as expected, should be fixed*/
/** */
/*eslint-disable */
export function validateArc(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    const cellSource = cellViewS.model
    const cellTarget = cellViewT.model

    console.log(end)
    console.log(linkView)
    
    if(magnetS === magnetT)
        return false

    if(cellSource instanceof joint.shapes.standard.Circle &&
        cellTarget instanceof joint.shapes.standard.Circle &&
            cellTarget.id != cellSource.id) {

                console.log("Place to place connections are not allowed!")
                return false
    }

    if(cellSource instanceof joint.shapes.standard.Rectangle &&
        cellSource instanceof joint.shapes.standard.Rectangle &&
            cellTarget.id != cellSource.id) {

                console.log("Transition to transition connection is not allowed")
                return false
    }

    return true
}