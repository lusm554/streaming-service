import React, { Component } from 'react';
import Stream from './components/Stream'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <Stream />
      </div>
    )
  }
}

export default App
