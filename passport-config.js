//to use local version of password
const LocalStrategy = require('passport-local').Strategy
//load up the user model
const User = require('../SimpleMath/app/models/users.model')
//make sure the password is the same as the password we need
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        //return user by email or return null if the email does not exist
        const user = getUserByEmail(email)
        console.log(user);
        if (user == null) { //if we can't find our user
            return done(null, false, { message: 'No user with that email' }) 
                            //"null" - we don't have an error, since that is on the server
                            //false because we found no user
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user) //password matches
            } else {
                return done(null, false, { message: 'Password incorrect' }) //password does not match
            }
        } catch (e) {
            return done(e)
        }
    };
    //use the local strategy
    passport.use(new LocalStrategy({ usernameField: 'email' }, //the usernameField is by default 'user', but we want it as 'email'
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id)) //stores user in session
    passport.deserializeUser((id, done) => {
        done(null, getUserById(id))
    }) //serialize our user as a single id
};

module.exports = initialize