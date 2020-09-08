import React, { Component } from 'react';

class StartStream extends Component {
    constructor() {
        super()
        this.startStream = this.startStream.bind(this)
        this.stopStream = this.stopStream.bind(this)
        this.videoRef = React.createRef()
  }

    async startStream() {
        const videoRef = this.videoRef.current

        videoRef.srcObject = await startCapture(gdmOptions)
    }

    stopStream() {
      const videoRef = this.videoRef.current
      let tracks = videoRef.srcObject.getTracks()

      tracks.forEach(track => track.stop());
      videoRef.srcObject = null;
    }

    render() {
        return (
        <div>
            <p>
              <input type="button" onClick={this.startStream} value="Start stream" style={{margin: 10}}></input>
              <input type="button" onClick={this.stopStream} value="Stop stream" style={{margin: 10}}></input>
            </p>
            <video ref={this.videoRef} autoPlay playsInline className="video" controls={false}></video>
        </div>
        )
    }
}

async function startCapture(displayMediaOptions) {
    let captureStream = null
  
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    } catch(err) {
      const isBrowserCannotStream = err.stack && err.stack.includes('getDisplayMedia') 
  
      if(isBrowserCannotStream) {
        alert('You cannot stream with this browser')
      }
      else {
        console.log(err)
      }
    }
    return captureStream
}

let ws = null;

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

function connect() {
  ws = new WebSocket('ws://localhost:8080/')
}

function sendToServer(msg) {
  let msgJSON = JSON.stringify(msg)

  log('Sending:', msg)
  ws.send(msgJSON)
}

ws.addEventListener('open', (e) => {
  log(e)
})

ws.addEventListener('message', (e) => {
  let msg = JSON.parse(e.data)
  log('Received:', msg)
})

let i = setInterval(() => {
  let stage = ws.readyState
  if(stage === 1) {
    sendToServer({name: 'ya'})
    clearInterval(i)
  }
}, 100)

export default StartStream
