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

const ws = new WebSocket('ws://localhost:8080')

ws.addEventListener('open', (e) => {
  console.log(e)
})

export default StartStream
