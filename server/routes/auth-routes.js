const passport = require('passport')
const google = require('passport-google-oauth')
const express = require('express')
const Router = express.Router()

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
Router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));


// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
Router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    function(req, res) {
        res.redirect('/');
});

Router.get('/user', (req, res) => {
    res.json(req.user)
})

Router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = Router