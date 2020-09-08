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

// connect WebSocket
connect()

// options to access the screen with sound on
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

function log(...text) {
  let time = new Date()
  console.log(`[${time.toLocaleTimeString()}]`, ...text)
}

function log_error(errObj) {
  let time = new Date()
  let { error, text } = errObj

  // checking text for an array
  Array.isArray(text) ? 
    console.log(`[${time.toLocaleTimeString()}]`, ...text, error) :
    console.log(`[${time.toLocaleTimeString()}]`, text, error)
}

function sendToServer(msg) {
  let msgJSON = JSON.stringify(msg)

  log('Sending:', msg)
  ws.send(msgJSON)
}

function connect() {
  ws = new WebSocket('ws://localhost:8089/')

  ws.addEventListener('open', (e) => {
    log(e)
  })

  ws.addEventListener('error', (error) => {
    log_error({ error, text: 'WebSocket Error' })
  })
  
  ws.addEventListener('close', (e) => {
    if(!e.wasClean) {
      log_error({ error: `Code ${e.code}`, text: 'Connection closed' })
    }
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

  tracks.forEach(track => track.stop());
  log('Stream stopped...')
  videoRef.srcObject = null;
}

// test ws connection
let i = setInterval(() => {
  let stage = ws.readyState
  if(stage === 1) {
    sendToServer({name: 'ya'})
    clearInterval(i)
  }
}, 100)

export default StartStream
