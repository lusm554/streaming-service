import React, { Component } from 'react'

const ws = new WebSocket('ws://localhost:8080')

ws.addEventListener('open', (e) => {
    console.log(e)
})

class Stream extends Component {
    constructor(props) {
        super(props) 
        this.state = {input: ''}
        this.changeHandler = this.changeHandler.bind(this)
        this.clickHandler = this.clickHandler.bind(this)
    }

    changeHandler(e) {
        let text = e.target.value
        this.setState({ input: text })
    }

    clickHandler() {
        ws.send(this.state.input)
        this.setState({input: ''})
    }

    render() {
        return (
            <div>
                <input type="text" onChange={this.changeHandler}></input>
                <button onClick={this.clickHandler}>Send message</button>
            </div>
        )
    }
}

export default Stream