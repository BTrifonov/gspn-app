//------------------------------------------
//Functions for working with sockets
//------------------------------------------

/**
 * Create a websocket connection to the backend
 * @returns 
 */
export async function createSocket() {
    return new Promise((resolve, reject) => {
        //Create a websocket to the backend, remote server config
        const socket = new WebSocket("wss://csl.bpm.in.tum.de/boris/ws")
    
        //Create a websocket to the backend, local development
        //const socket = new WebSocket("ws://localhost:7000/ws")

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

/**
 * Close the socket connection to the backend
 * @param {*} socket 
 * @returns 
 */
export async function closeSocket(socket) {
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

/**
 * Check if the socket is still open
 * @param {*} socket 
 * @returns 
 */
export function isSocketOpen(socket) {
    return socket.readyState === WebSocket.OPEN;
}

/**
 * 
 * @param {*} event 
 * @returns 
 */
export async function receiveMsg(event) {
    return event.data
}

/**
 * Send a msg via the socket, passed in the parameter
 * @param {*} socket The socker via which the message is sent
 * @param {*} payload The msg to be sent
 */
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

/**
 * Create a message and parse it with JSON.stringify()
 * @param {*} senderData 
 * @param {*} receiverData 
 * @param {*} actionData 
 * @param {*} statusData 
 * @param {*} contentData 
 * @returns 
 */
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