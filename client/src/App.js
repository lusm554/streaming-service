import React, { Component, lazy, Suspense } from 'react';
import Header from './components/Header';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// pages
const StartStream = lazy(() => import('./components/StartStream'))
const Profile = lazy(() => import('./components/Profile'))
const Stream = lazy(() => import('./components/Stream'))

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
      <Suspense fallback={<div>Page loading...</div>}>
        <Router> 
        <div className="nav">
          <Header authenticated={this.state.authenticated}/>
          <Switch>
            <Route path="/start-stream" component={ StartStream } />
            <Route path="/channel" component={ Profile } />
            <Route path="/stream" component={ Stream } />
            <Route path="/">
              <h1>home</h1>
            </Route>
          </Switch>
        </div>
        </Router>
      </Suspense>
    )
  }
}

export default App
