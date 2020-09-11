import React, { Component } from 'react'
import { log, log_error } from '../log_info'

class Stream extends Component {
    constructor(props) {
        super(props) 
        this.streamRef = React.createRef()
    }

    render() {
        return (
            <div>
                <video ref={this.streamRef} autoPlay playsInline className="streamVideo" id="video"></video>
                <button className="play_button" onClick={() => addVideo(this.streamRef.current)}>Play</button>
            </div>
        )
    }
}

let ws = null 
let currentPeerConnection = null
let stream = null

connect()

function connect() {
    ws = new WebSocket('ws://localhost:8080')

    ws.addEventListener('open', (e) => {
        console.log('Connection open', e)
        ws.send(JSON.stringify({ test: 'message from Stream.js'}))
    })

    ws.addEventListener('message', (e) => {
        let msg = JSON.parse(e.data), { type } = msg
        switch (type) {
            case 'video-offer':
                handleVideoOfferMsg(msg)
                break;
            
            case 'message':
                log(msg)
                break;
            default:
                break;
        }
    })
}

async function handleVideoOfferMsg(msg) {

    if(!currentPeerConnection) {
        createPeerConnection()
    }

    // Set the remote description to the received SDP offer.
    let desc = new RTCSessionDescription(msg.sdp)

    // Setting remote description.
    await currentPeerConnection.setRemoteDescription(desc)
}//received_video

async function createPeerConnection() {
    log('Setting up a connection...')

    currentPeerConnection = new RTCPeerConnection(/*{ options }*/)

    currentPeerConnection.ontrack = handleTrackEvent
}

function handleTrackEvent(event) {
    log('>>> Track event')  
    stream = event.streams[0]
}

function addVideo(streamRef) {
    streamRef.srcObject = stream
}

export default Stream