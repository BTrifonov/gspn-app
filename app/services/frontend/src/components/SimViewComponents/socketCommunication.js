//------------------------------------------
//Functions for working with sockets
//------------------------------------------

export async function createSocket() {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket("wss://csl.bpm.in.tum.de/boris/ws/123")
    
        //Log the socket creation
        socket.onopen = function(event)  {
            console.log(event)
            console.log("[open] Connection established")
            resolve(socket)
        }

        socket.onerror = function (error) {
            console.error("[error] WebSocket error:", error);
            reject(error);
        };
    })
}

export function closeSocket(socket) {
    return new Promise((resolve, reject)=>{
        //Log the socket closure
        socket.onclose = function(event) {
            if(event.wasClean) {
                console.log('[close] Connection closed')
                resolve(socket)
            } else {
                console.log('[close] Connection died')
                resolve(socket)
            }
        }

        socket.onerror = function (error) {
            console.error("[error] WebSocket error:", error);
            reject(error);
        };

        //Close the socket
        socket.close(1000, "Close gracefully");
    })
}

export function isSocketOpen(socket) {
    return socket.readyState === WebSocket.OPEN;
}

export async function receiveMsg(event) {
    return event.data
}

export async function sendMsg(socket, payload) {
    const action = payload.action
    const status = payload.status
    const data = payload.data

    const sender = 'frontend'
    const receiver = 'backend'

    const msg = createMsg(sender, receiver, action, status, data)
    await socket.send(msg)
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