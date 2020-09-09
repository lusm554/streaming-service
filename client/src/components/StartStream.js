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
    console.log(`[${time.toLocaleTimeString()}]`, ...text, error) :
    console.log(`[${time.toLocaleTimeString()}]`, text, error)
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
    let msg = JSON.parse(e.data)
    log('Received:', msg)
  })
}

async function startStream(videoRef) {
  try {
    // log('Creating peer connection...')
    // createPeerConnection()

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
}

// Test ws connection.

let i = setInterval(() => {
  let stage = ws.readyState
  if(stage === 1) {
    sendToServer({name: 'ya'})
    clearInterval(i)
  }
}, 100)

export default StartStream
