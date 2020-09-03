const express = require('express');
const app = express()
const config = require('config')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
const passport = require('passport')
const User = require('./models/user')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cookieSession = require('cookie-session')
const cors = require('cors')

mongoose.connect(config.get('mongoID'), { useNewUrlParser: true, useUnifiedTopology: true })

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// app.use('/auth', require('./routes/auth-routes'))

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
}

app.use('/*', (req, res) => res.redirect('/'))

app.listen(config.get('port'))