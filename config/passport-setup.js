const passport = require('passport')
const config = require('config')
const User = require('../server/models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findOne({ id }, (err, user) => {
        done(err, user)
    })
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: config.get("GOOGLE_CLIENT_ID"),
    clientSecret: config.get("GOOGLE_CLIENT_SECRET"),
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    let { id, name } = profile

    const currentUser = await User.findOne({ id }).exec()
    if(currentUser) {
        return done(null, currentUser)
    }
    let user = { id, name }
    await User.create(user)

    return done(null, user)
  }
));