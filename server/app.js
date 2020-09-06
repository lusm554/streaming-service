const express = require('express');
const app = express()
const config = require('config')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
require('../config/passport-setup')
const passport = require('passport')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')

mongoose.connect(config.get('mongoID'), { useNewUrlParser: true, useUnifiedTopology: true })

app.use(
    cookieSession({
      name: "session",
      keys: [config.get('SESSION_KEY')],
      maxAge: 24 * 60 * 60 * 100
    })
  );
  
// parse cookies
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

function authValidation(req, res, next) {
    if(!req.user) {
        res.json({
            authenticated: false,
            message: "user has not been authenticated"
        })
    }
    else {
        next()
    }
}

app.use('/auth', require('./routes/auth-routes'))

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
}

app.use('/*', authValidation, (req, res) => res.redirect('/'))

/* create server for WebSocket */ 
const http = require('http')
const server = http.createServer(app)
server.listen(config.get('port'))

/* connect WebSocket */ 
module.exports = server
require('./routes/SocketStream')