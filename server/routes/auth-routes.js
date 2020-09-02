const express = require('express')
const Router = express.Router()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const config = require('config'), 
GOOGLE_CONSUMER_KEY = config.get('GOOGLE_CONSUMER_KEY'), 
GOOGLE_CONSUMER_SECRET = config.get('GOOGLE_CONSUMER_SECRET');

passport.use(new GoogleStrategy({ 
        consumerKey: GOOGLE_CONSUMER_KEY, 
        consumerSecret: GOOGLE_CONSUMER_SECRET, 
        callbackURL: "http://localhost:8080/auth/google/redirect" 
    },
    function(token, tokenSecret, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
    });
  }
));

Router.get('/google', passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }))

Router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('http://localhost:8080/');
})

module.exports = Router