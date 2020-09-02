const express = require('express')
const Router = express.Router()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('config'), 
GOOGLE_CLIENT_ID = config.get('GOOGLE_CLIENT_ID'), 
GOOGLE_CLIENT_SECRET = config.get('GOOGLE_CLIENT_SECRET');

passport.use(new GoogleStrategy({ 
        clientID: GOOGLE_CLIENT_ID, 
        clientSecret: GOOGLE_CLIENT_SECRET, 
        callbackURL: "http://localhost:8080/auth/google/callback" 
    },
    function(accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        done()
  }
));

Router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }) )

Router.get('/google/callback', (req, res, next) => {console.log(req.query); next() },
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('http://localhost:8080/auth/google');
})

module.exports = Router