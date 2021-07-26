const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } =  process.env;
// const { Strategy } = require('passport-google-oauth20');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();

const mongoose = require('mongoose')
const myKey = require('../setup/myurl')
const Person = mongoose.model("myPerson")

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = myKey.secret;

module.exports = passport =>{
    passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
        Person.findById(jwt_payload.id)
        .then(person=>{
            if(person){
                return done(null,person)
            }

            return done(null,false)
        })
        .catch(err=>console.log(err))
    }))



    // Google login 

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/google/return'
      },
      function(accessToken, refreshToken, profile, done) {
        // Person.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return done(err, user);
        // });
        return done(null,profile)}
  //       Person.findOne({googleId:profile.id}
  //         ,function(err,user){
  //           if (err) {
  //             return done(err);
  //         }
  //         if(!user){
  //           const newperson = new Person({
  //             name:profile.displayName,
  //             email:profile.emails[0].value,
  //             username: profile.username,
  //             google: profile._json,
  //             googleId:profile.id,
  //             password:'123456'
  //           })
  
  //           newperson.save(function(err) {
  //             if (err) console.log(err);
  //             return done(err, user);
  //         });
  //         } else {
  //           //found user. Return
  //           return done(err, user);
  //       }
  //         }
  //         )
        
  //  }
    ));
    
    passport.serializeUser((user, cb) => {
      cb(null, user);
    });
    
    passport.deserializeUser((obj, cb) => {
      cb(null, obj);
    });

}