const WebSocket = require('ws')
const server = require('../app')
const wss = new WebSocket.Server({ server })
const cors = require('cors')
const { Router } = require('express')

Router.use(cors)

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

module.exports = Router