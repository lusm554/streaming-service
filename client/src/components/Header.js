import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    login() {    
        window.location.href = 'http://localhost:8080/auth/google'
    }

    logout() {    
        window.location.href = 'http://localhost:8080/auth/logout'
    }

    render() {
        return(
        <ul>
            <li> <Link to="/">Home</Link> </li>
            <li> <Link to="/start-stream">Stream settings</Link> </li>
            <li onClick={this.login.bind(this)}> <Link to="/auth/google">Login</Link> </li>
            <li onClick={this.logout.bind(this)}> <Link to="/auth/google">Logout</Link> </li>
        </ul>
        )
    }
}

export default Header