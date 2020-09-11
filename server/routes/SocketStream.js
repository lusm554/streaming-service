const WebSocket = require('ws')
const server = require('../app')
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
    // Setting up a user for the websocket.
    ws.user = server.user

    ws.on('message', function incoming(message) {
        let clientObj = JSON.parse(message)
        console.log(message)
        sendToClient(ws, clientObj)
    });
   
});

function sendToClient(ws, msg) {
    let msgJSON = JSON.stringify(msg)
    ws.send(msgJSON)
}

function sendStream(msg) {
    let clients = wss.clients
}
