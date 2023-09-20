
export function handleIncomingMsg(event) {
    const msgJSON = event.data
    const msg = JSON.parse(msgJSON)

    switch (msg.action) {
        case "visualize_fired_transition": {
            //TODO:

            break
        }
    }

}


//-----------------------------------------------------------
//Internal helper methods, used only in socketCommunication.js
//-----------------------------------------------------------

function createMsg(senderData, receiverData, actionData, statusData, contentData) {
    const msg = JSON.stringify({
        sender: senderData, 
        receiver: receiverData, 
        action: actionData,
        status: statusData,
        data: contentData,
    })

    return msg
}