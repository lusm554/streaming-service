import React, { Component } from 'react';
import StartStream from './components/StartStream';
import Header from './components/Header';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Profile from './components/Profile'
import Stream from './components/Stream';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    fetch('http://localhost:8080/auth/user')  
      .then(res => {
        return res.status === 200 ? res.json() : new Error('failed to load user')
      })
      .then(
        user => {
          this.setState({ user, authenticated: true })
      },
        error => {
          this.setState({ error, authenticated: false })
        }
      )
  }

  logout() {
    fetch('http://localhost:8080/auth/logout')
  }

  render() {
    return (
      <div>
        <Router> 
        <div className="nav">
          <Header authenticated={this.state.authenticated}/>
          <Switch>
            <Route path="/start-stream">
              <StartStream />
            </Route>
            <Route path="/channel">
              <Profile />
            </Route>
            <Route path="/stream">
              <Stream />
            </Route>
            <Route path="/">
              <h1>home</h1>
            </Route>
          </Switch>
        </div>
        </Router>
      </div>
    )
  }
}

export default App
