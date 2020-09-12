const WebSocket = require('ws')
const server = require('../app')
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
    // Setting up a user for the websocket.
    ws.user = server.user

    ws.on('message', function incoming(json_message) {
        let msg = JSON.parse(json_message)

        switch (msg.type) {
            case 'video-answer':
            case 'video-offer':
            case 'new-ice-candidate':
                sendStream(ws, json_message)
                break;
            case 'message': 
                sendStream(ws, json_message);
                break;
            default:
                break;
        }
    });
   
});

function echo(ws, msg) {
    let msgJSON = JSON.stringify(msg)
    ws.send(msgJSON)
}

function sendStream(ws, msg) {
    let clients = wss.clients

    for(let client of clients) {
        let { id } = client.user
        if(ws.user.id != id) {
            client.send(msg)
        }
    }
}
