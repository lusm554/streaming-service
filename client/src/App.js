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
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    fetch('http://localhost:8080/auth/user')  
      .then(res => {
        return res.status === 200 ? res.json() : new Error('failed to load user')
      })
      .then(user => {
        console.log(user)
        this.setState({user, authenticated: true})
      })
      .catch(err => ({err: err, authenticated: false}))
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
