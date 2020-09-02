const express = require('express');
const app = express()
const config = require('config')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(config.get('mongoID'), { useNewUrlParser: true, useUnifiedTopology: true })

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/auth', require('./routes/auth-routes'))

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
}

app.get('/', (req, res) => {
    res.send('1')
})

app.listen(config.get('port'))