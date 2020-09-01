import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super()
    this.clickHandler = this.clickHandler.bind(this)
  }

  async clickHandler() {
    let mediaStream = await startCapture()
    console.log(mediaStream)
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
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  } catch(err) {
    const isBrowserCannotStream = err.stack && err.stack.includes('getDisplayMedia') 
    if(isBrowserCannotStream) {
      alert('You cannot stream with this browser')
    }
    else {
      console.log(err)
    }
  }
  return captureStream;
}

export default App;
