import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return(
        <ul>
            <li> <Link to="/">Home</Link> </li>
            <li> <Link to="/start-stream">Stream settings</Link> </li>
        </ul>
        )
    }
}

export default Header