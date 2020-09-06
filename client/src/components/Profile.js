import React, { Component } from 'react';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            user: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:8080/auth/user')  
            .then(res => {
                return res.status === 200 ? res.json() : new Error('failed to load user')
            })
            .then(
                user => {
                    this.setState({ user, authenticated: true, isLoaded: true })
                },
                error => {
                    this.setState({ error, isLoaded: true })
                } 
            )
    }

    render() {
        const { error, isLoaded, user } = this.state;
        if(error) {
            return <div>Error: { error.message }</div>
        }
        else if(!isLoaded) {
            return <div>Loading....</div>
        }
        else {
            let { id, name: { givenName } } = user
            return (
                <div>
                    <p>Name: { givenName }</p>
                    <p>Id: { id }</p>
                </div>
            )
        }
    }
}

export default Profile