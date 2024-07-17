const passport = require('passport');
const { ObjectID } = require('mongodb');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt') 
const GitHubStrategy = require('passport-github').Strategy;
require('dotenv').config();

module.exports = function (app, myDataBase) {
    passport.initialize()
    passport.session()
    
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    
    passport.deserializeUser((id, done) => {
      myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        done(null, doc);
      });
    });
    
    passport.use(new LocalStrategy((username, password, done) => {
      myDataBase.findOne({ username: username }, (err, user) => {
        console.log(`User ${username} attempted to log in.`);
        if (err) return done(err);
        if (!user) return done(null, false);
        if (!bcrypt.compareSync(password, user.password)) { 
          return done(null, false);
        }
        return done(null, user);
      });
    }));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'https://3000-exiltruman-fccboilerpla-cmhxkox7p0x.ws-eu115.gitpod.io/auth/github/callback'
      },
        function(accessToken, refreshToken, profile, cb) {
          console.log(profile);
          //Database logic here with callback containing your user object
        }
      ));
}