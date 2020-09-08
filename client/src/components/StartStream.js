import React, { Component } from 'react';

class StartStream extends Component {
  constructor() {
    super()
      this.startStream = this.startStream.bind(this)
      this.videoRef = React.createRef()
  }

  async startStream(videoRef) {
    videoRef.srcObject = await startCapture(gdmOptions)
  }

  render() {
    return (
      <div>
        <p>
          <input type="button" onClick={() => this.startStream(this.videoRef.current)} value="Start stream" style={{margin: 10}}></input>
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
const gdmOptions = {
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

function log_error(...text) {
  let time = new Date()
  console.log(`[${time.toLocaleTimeString()}]`, ...text)
}

function sendToServer(msg) {
  let msgJSON = JSON.stringify(msg)

  log('Sending:', msg)
  ws.send(msgJSON)
}

function connect() {
  ws = new WebSocket('ws://localhost:8080/')

  ws.addEventListener('open', (e) => {
    log(e)
  })

  ws.addEventListener('error', (e) => {
    log_error(e)
  })
  
  ws.addEventListener('message', (e) => {
    let msg = JSON.parse(e.data)
    log('Received:', msg)
  })
}

async function startCapture(displayMediaOptions) {
  try {
    log('Getting media stream...')
    mediaStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
  } catch(err) {
    const isBrowserCannotStream = err.stack && err.stack.includes('getDisplayMedia') 

    if(isBrowserCannotStream) {
      alert('You cannot stream with this browser')
      log_error('You cannot stream in this browser:', err)
    }
    else {
      log_error(err)
    }
  }
  return mediaStream
}

function stopStream(videoRef) {
  let tracks = videoRef.srcObject.getTracks()

  tracks.forEach(track => track.stop());
  videoRef.srcObject = null;
}

let i = setInterval(() => {
  let stage = ws.readyState
  if(stage === 1) {
    sendToServer({name: 'ya'})
    clearInterval(i)
  }
}, 100)

export default StartStream
