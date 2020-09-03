const express = require('express')
const Router = express.Router()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('config'), 
GOOGLE_CLIENT_ID = config.get('GOOGLE_CLIENT_ID'), 
GOOGLE_CLIENT_SECRET = config.get('GOOGLE_CLIENT_SECRET');

const User = require('../models/user')

passport.use(new GoogleStrategy({ 
        clientID: GOOGLE_CLIENT_ID, 
        clientSecret: GOOGLE_CLIENT_SECRET, 
        callbackURL: "http://localhost:8080/auth/google/callback" 
    },
    async function(accessToken, refreshToken, profile, done) {
        const {id: user_id, name } = profile
        const isUserExist = await User.exists({ user_id })
        if(isUserExist) {
            const user = await User.findOne({ user_id })
            return done(null, user)
        }

        const newUser = { user_id, name }
        req.user = newUser
        User.create(newUser, function (err, user) {
            return done(err, newUser);
        });
  }
));

Router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }) )

Router.get('/google/callback',
    // authenticate user and set req.user
    passport.authenticate('google', { 
            failureRedirect: 'http://localhost:8080/auth/google', 
            /* successRedirect: 'http://localhost:8080/' */
        }
    ),
    function(req, res) {
        console.log(req.user)
        res.redirect('/')
    }
)

Router.get('/google/login/success', (req, res) => {
    console.log(req.user)
    res.json(req.user)
})

module.exports = Router