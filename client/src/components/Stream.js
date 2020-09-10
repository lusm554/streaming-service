import React, { Component } from 'react'

let ref = null

class Stream extends Component {
    constructor(props) {
        super(props) 
        this.state = {ref: null}
        this.streamRef = React.createRef()
    }

    componentDidMount() {
        // Set streamRef to global variable 
        ref = this.streamRef
    }

    render() {
        return (
            <div>
                <video ref={this.streamRef} autoPlay playsInline className="streamVideo" id="video"></video>
                <button className="play_button">Play</button>
            </div>
        )
    }
}

let ws = null 
let currentPeerConnection = null
let remoteSteam = null

async function handleVideoOfferMsg(msg) {
    
    // If we are not already connected, create an RTCPeerConnection.
    if(!currentPeerConnection) {
        createPeerConnection()
    }
    
    // Set the remote description to the received SDP offer.
    let desc = new RTCSessionDescription(msg.sdp)

    // If the connection isn't stable we need to wait.
    
    if(currentPeerConnection.signalingState !== 'stable') {
        await Promise.all([
            currentPeerConnection.setLocalDescription({ type: 'rollback' }),
            currentPeerConnection.setRemoteDescription(desc)
        ])
        return;
    }
    else {
        // Setting remote description.
        await currentPeerConnection.setRemoteDescription(desc)
    }
}

connect()

function connect() {
    ws = new WebSocket('ws://localhost:8080')

    ws.addEventListener('open', (e) => {
        console.log('Connection open', e)
        ws.send(JSON.stringify({ test: 'message from Stream.js'}))
    })

    ws.addEventListener('message', (e) => {
        let msg = JSON.parse(e.data)
        // handleVideoOfferMsg(msg)
        console.log(msg)
    })
}

function createPeerConnection() {
    currentPeerConnection = new RTCPeerConnection({/* options */})
    /* Event handlers here */
}

export default Stream