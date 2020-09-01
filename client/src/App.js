import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super()
    this.clickHandler = this.clickHandler.bind(this)
  }

  async clickHandler() {
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

    let mediaStream = await startCapture(gdmOptions)
    console.log(mediaStream.id)
  }

  render() {
    return (
      <div>
        <input type="button" onClick={this.clickHandler} value="Start stream"></input>
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

export default App
