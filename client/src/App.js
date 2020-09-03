import React, { Component } from 'react';
import Stream from './components/Stream';
import Header from './components/Header';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router> 
        <div className="nav">
          <Header />
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
