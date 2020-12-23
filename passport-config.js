//to use local version of password
const LocalStrategy = require('passport-local').Strategy
//load up the user model
// const User = require('../SimpleMath/app/models/users.model')
const userMethod = require('./app/controllers/users.controller')
//make sure the password is the same as the password we need
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        //return user by email or return null if the email does not exist
        userMethod.findOne({email, password})
        .then( async user => {
            if (!user) { //if we can't find our user
            return done(null, false, { message: 'No user with that email' }) 
                            //"null" - we don't have an error, since that is on the server
                            //false because we found no user
        } else {
            return done(null, user);
        }
    

        // try {
        //     if (await bcrypt.compare(req.password, user.password)) {
        //         return done(null, user) //password matches
        //     } else {
        //         return done(null, false, { message: 'Password incorrect' }) //password does not match
        //     }
        // } catch (e) {
        //     return done(e)
        // }
        });
    };
    //use the local strategy
    passport.use(new LocalStrategy({ usernameField: 'email' }, //the usernameField is by default 'user', but we want it as 'email'
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user)) //stores user in session
    passport.deserializeUser((user, done) => {
        done(null, user)
    }) //serialize our user as a single id
};

module.exports = initialize