import React, { Component } from 'react';
import Stream from './components/Stream';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router> 
        <div className="nav">
          <ul>
            <li> <Link to="/">Home</Link> </li>
            <li> <Link to="/start-stream">Stream settings</Link> </li>
          </ul>
          
          <Switch>
            <Route path="/start-stream">
              <Stream />
            </Route>
            <Route path="/">
              <h1>home</h1>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
