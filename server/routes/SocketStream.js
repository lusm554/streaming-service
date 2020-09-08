const WebSocket = require('ws')
const server = require('../app')
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // let clientObj = JSON.parse(message)
        console.log(message)
    });
   
    ws.send(
        JSON.stringify({
            type: 'message',
            data: 'hi'
        })
    );
});