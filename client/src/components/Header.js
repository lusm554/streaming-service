import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    login() {    
        window.location.href = 'http://localhost:8080/auth/google'
    }

    logout() {    
        window.location.href = 'http://localhost:8080/auth/logout'
    }

    isUserAuthenticated(e) {
        const authenticated = this.props.authenticated
        if(!authenticated) {
            e.preventDefault()
            alert('You need to log into your account.')
        }
    }

    render() {
        const authenticated = this.props.authenticated
        return(
            <div>
                <ul>
                    <li> <Link to="/">Home</Link> </li>
                    <li> <Link to="/start-stream" onClick={this.isUserAuthenticated.bind(this)}>Stream settings</Link> </li>
                    {authenticated ? 
                        <li onClick={this.logout.bind(this)}> <Link to="/auth/google">Logout</Link> </li> :
                        <li onClick={this.login.bind(this)}> <Link to="/auth/google">Login</Link> </li> 
                    }
                    <li> <Link to="/channel" onClick={this.isUserAuthenticated.bind(this)} >Channel</Link> </li>
                    <li> <Link to="/stream">Browse</Link> </li>
                </ul>
            </div>
        )
    }
}

export default Header