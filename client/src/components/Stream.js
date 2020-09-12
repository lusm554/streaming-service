import React, { Component } from 'react'
import { log, log_error, sendToServer } from '../log_info'

class Stream extends Component {
    constructor(props) {
        super(props) 
        this.streamRef = React.createRef()
    }

    componentDidMount() {
        setInterval(() => {
            // addVideo(this.streamRef)
        }, 1000);
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
        console.log('Connection open')
        ws.send(JSON.stringify({ test: 'message from Stream.js'}))
    })

    ws.addEventListener('message', (e) => {
        let msg = JSON.parse(e.data), { type } = msg
        switch (type) {
            case 'video-offer':
                handleVideoOfferMsg(msg)
                break;
            case 'new-ice-candidate':
                handleNewICECandidateMsg(msg)
                break;
            case 'message':
                log('Received:', msg)
                break;
            default:
                break;
        }
    })
}

async function handleNewICECandidateMsg(msg) {
    let candidate = new RTCIceCandidate(msg.candidate)

    log('>>> Adding received ICE candidate')
    try {
        await currentPeerConnection.addIceCandidate(candidate)
    } catch (error) {
        log_error({ error, text: 'Problem with adding new ice candidate' })
    }
}

async function handleVideoOfferMsg(msg) {
    // If we are not already connected 
    if(!currentPeerConnection) {
        createPeerConnection()
    }

    // Set the remote description to the received SDP offer.
    let desc = new RTCSessionDescription(msg.sdp)

    // Setting remote description.
    await currentPeerConnection.setRemoteDescription(desc)

    log('>>> Creating and sending answer to streamer')
    await currentPeerConnection.setLocalDescription(await currentPeerConnection.createAnswer())

    sendToServer({
        type: 'video-answer',
        sdp: currentPeerConnection.localDescription
    }, ws)
}

async function createPeerConnection() {
    log('Setting up a connection...')

    currentPeerConnection = new RTCPeerConnection(/*{ options }*/)

    currentPeerConnection.ontrack = handleTrackEvent
    currentPeerConnection.onicecandidate = handleICECandidateEvent
    currentPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent
    currentPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent
}

function handleICEConnectionStateChangeEvent(e) {
    log('ICE connection stage changed to:', currentPeerConnection.iceConnectionState)
  
    if(currentPeerConnection.iceConnectionState === 'disconnected') {
      log('ICE connection disconnected')
    }
}

function handleTrackEvent(e) {
    log('>>> Track event')  
    stream = e.streams[0]
}

function addVideo(streamRef) {
    streamRef.srcObject = stream
}

function handleICECandidateEvent(e) {
    if(e.candidate) {
        log('>>>  Outgoing ICE candidate:', e.candidate.candidate)

        sendToServer({
            type: 'new-ice-candidate',
            candidate: e.candidate
        }, ws)
    }
}

async function handleNegotiationNeededEvent(e) {
    log('>>> Negotiation needed');

    try {
        log('>>> Creating offer')
        const offer = await currentPeerConnection.createOffer()

        if (currentPeerConnection.signalingState !== "stable") {
            log("-- The connection isn't stable yet; postponing...")
            return;
        }

        log('>>> Setting local description the offer')
        await currentPeerConnection.setLocalDescription(offer)

        log('>>> Setting the offer to the remote peer')
        sendToServer({
            type: 'video-offer',
            sdp: currentPeerConnection.localDescription
        }, ws)
    } catch (error) {
        log_error({ error, text: '>>> The following error occurred while handling the negotiationneeded event' })
    }
}

export default Stream