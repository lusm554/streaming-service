import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super()
    this.clickHandler = this.clickHandler.bind(this)
  }

  clickHandler() {
    startCapture()
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
    console.error("Error: " + err);
  }
  return captureStream;
}

export default App;
