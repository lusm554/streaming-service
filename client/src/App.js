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

  getUser() {
    fetch('http://localhost:8080/auth/user').then(res => res.json()).then(console.log)
  }

  logout() {
    fetch('http://localhost:8080/auth/logout')
  }

  render() {
    return (
      <div>
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
        <button onClick={this.getUser.bind(this)}>Get user data</button>
      </div>
    )
  }
}

export default App
