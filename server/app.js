const express = require('express');
const app = express()
const config = require('config')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
require('../config/passport-setup')
const session = require("express-session")
const passport = require('passport')

mongoose.connect(config.get('mongoID'), { useNewUrlParser: true, useUnifiedTopology: true })

// use before passport.session()
app.use(session({ secret: config.get('SESSION_KEY') }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth-routes'))

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
}

app.use('/*', (req, res) => res.redirect('/'))

app.listen(config.get('port'))