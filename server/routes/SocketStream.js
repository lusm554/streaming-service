const WebSocket = require('ws')
const server = require('../app')
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        let clientObj = JSON.parse(message)
        console.log(message)
        sendToClient(ws, message)
    });
   
});

function sendToClient(ws, msg) {
    let msgJSON = JSON.stringify(msg)
    ws.send(msgJSON)
}