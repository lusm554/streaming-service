import React, { Component } from 'react'

class Stream extends Component {
    constructor(props) {
        super(props) 
        this.state = {}
    }

    render() {
        return (
            <div>
                hi
            </div>
        )
    }
}

let ws = null 

async function handleVideoOfferMsg(msg) {
    console.log(msg)
}

connect()

function connect() {
    ws = new WebSocket('ws://localhost:8080')

    ws.addEventListener('open', (e) => {
        console.log('Connection open', e)
        ws.send(JSON.stringify({ test: 'message from Stream.js'}))
    })

    ws.addEventListener('message', (e) => {
        let msg = JSON.parse(e.data)
        handleVideoOfferMsg(msg)
    })
}

export default Stream