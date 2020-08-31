const express = require('express');
const app = express()
const config = require('config')
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
}

app.get('/', (req, res) => {
    res.send('1')
})

app.listen(config.get('port'))