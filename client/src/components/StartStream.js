import React, { Component } from 'react';

class StartStream extends Component {
  constructor() {
    super()
      this.videoRef = React.createRef()
  }

  render() {
    return (
      <div>
        <p>
          <input type="button" onClick={() => startStream(this.videoRef.current)} value="Start stream" style={{margin: 10}}></input>
          <input type="button" onClick={() => stopStream(this.videoRef.current)} value="Stop stream" style={{margin: 10}}></input>
        </p>
        <video ref={this.videoRef} autoPlay playsInline className="video" controls={false}></video>
      </div>
      )
  }
}

let ws = null
let currentPeerConnection = null
let mediaStream = null

// Connect WebSocket.
connect()

// Options to access the screen with sound on.

const displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100
  }
}

// Outputting information to the console.

function log(...text) {
  let time = new Date()
  console.log(`[${time.toLocaleTimeString()}]`, ...text)
}

// Outputting error message to the console.

function log_error(errObj) {
  let time = new Date()
  let { error, text } = errObj

  // Checking text for an array.
  Array.isArray(text) ? 
    console.error(`[${time.toLocaleTimeString()}]`, ...text, error) :
    console.error(`[${time.toLocaleTimeString()}]`, text, error)
}

// Send an object by converting it to JSON and sending 
// it as a message to the WebSocket.

function sendToServer(msg) {
  let msgJSON = JSON.stringify(msg)

  log('Sending:', msg)
  ws.send(msgJSON)
}

function connect() {
  ws = new WebSocket('ws://localhost:8080/')

  ws.addEventListener('open', (e) => {
    log('Connection open', e)
  })

  ws.addEventListener('error', (error) => {
    log_error({ error, text: 'WebSocket Error' })
  })
  
  ws.addEventListener('close', (e) => {
    if(!e.wasClean) {
      log_error({ error: `Code ${e.code}`, text: 'Connection closed' })
    }
    log('Connection close', e)
  })

  ws.addEventListener('message', (e) => {
    let msg = JSON.parse(e.data), { type } = msg

    switch (type) {
      case 'new-ice-candidate':
        handleNewICECandidateMsg(msg)
        break;
      
      case 'message': 
        log('Received:', msg)
        break;
      
      default:
        log_error({ error: msg, text: 'Unknown message received:' })
    }
  })
}

async function handleNewICECandidateMsg(msg) {
  // Create new ICE candidate.
  let candidate = new RTCIceCandidate(msg.candidate)

  try {
    await currentPeerConnection.addIceCandidate(candidate)
  } catch (error) {
    log_error({ error, text: 'Problem with new ICE candidate'})
  }
}

async function createPeerConnection() {
  log('Setting up connection...')

  // Create an RTCPeerConnection 

  currentPeerConnection = new RTCPeerConnection(/* { options } */)

  // Set up event handlers for the ICE negotiation process.
  currentPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent
}

async function handleNegotiationNeededEvent() {
  log('>>> Start of negotiations')

  try {
    log('>>> Creating offer')
    // Create SDP offer
    const offer = await currentPeerConnection.createOffer()

    // Check for connection state, if the connection hasn't yet achieved the 'stable'
    // state, return to the caller.

    if(currentPeerConnection.signalingState !== 'stable') {
      log('The connection isn\'t stable yet')
      return;
    }

    // Establish the offer as the local peer's current
    // description.
    log('>>> Setting local description to the offer')
    await currentPeerConnection.setLocalDescription(offer)

    // Send the offer to the remote peer.
    log('>>> Sending the offer to the remote peer')
    sendToServer({
      type: 'video-offer',
      sdp: currentPeerConnection.localDescription
    })
  } catch (error) {
    log_error({ 
      error, 
      text: '>>> The following error occurred while handling the negotiationneeded event:' 
    })
  }
}

function handleICECandidateEvent(e) {
  if(e.candidate) {
    log('ICE candidate', e.candidate.candidate) 

    sendToServer({
      type: 'new-ice-candidate',
      candidate: e.candidate
    })
  }
}

function handleICEConnectionStateChangeEvent(e) {
  log('ICE connection stage changed to:', currentPeerConnection.iceConnectionState)

  if(currentPeerConnection.iceConnectionState === 'disconnected') {
    log('ICE connection disconnected')
  }
}

async function startStream(videoRef) {
  if(currentPeerConnection) {
    alert('You cannot start stream because you already have one open')
  }
  else {
    // Call createPeerConnection() to create the RTCPeerConnection.

    log('Creating peer connection...')
    createPeerConnection()
  }

  try {
    log('Getting media stream...')
    mediaStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    log('Media stream:', mediaStream)
    videoRef.srcObject = mediaStream
  } catch(error) {
    const isBrowserCannotStream = error.stack && error.stack.includes('getDisplayMedia') 

    if(isBrowserCannotStream) {
      alert('You cannot stream with this browser')
      log_error({ text: 'You cannot stream in this browser:', error })
    }
    else {
      log_error({ error })
    }

    // Add tracks from the stream to the RTCPeerConnection.
    // Define a list of MediaStream objects to add to the transceivers RTCRtpReceiver;
    // when the remote peer's RTCPeerConnections track occurs, these are the streams
    // that will be specified by that event.

    try {
      mediaStream.getTracks().forEach(track => {
        currentPeerConnection.addTransceiver(track, { streams: [mediaStream] })
      })
    } catch (error) {
      log_error({ error, text: 'Error with add tracks to the RTCPeerConnection:' })
    }
  }
}

function stopStream(videoRef) {
  let tracks = videoRef.srcObject.getTracks()

  log('Closing the stream...')

  // Stop stream and clear variables.

  tracks.forEach(track => track.stop())
  currentPeerConnection = null 
  videoRef.srcObject = null
  mediaStream = null 
  log('Stream closed.')

  // Stop and close peer connection will be here...
}

// Test ws connection.
let i = setInterval(() => {
  let stage = ws.readyState
  if(stage === 1) {
    sendToServer({name: 'ya', type: 'message'})
    clearInterval(i)
  }
}, 100)

export default StartStream
