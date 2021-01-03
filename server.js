if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
//library for loading the things we need
const express = require('express');
const app = express();
//library for hashing our users passwords (also compares hashed passwords to make sure our app is secure)
const bcrypt = require('bcrypt');
//libraries needed to know to use passport
const flash = require('express-flash');
const session = require('express-session');
//library for logging out
const methodOverride = require('method-override');
//library for passport
const passport = require('passport');
const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);
//library for cors middleware that lets us enable CORS
const cors = require('cors');
const axios = require('axios');



//local variable instead of connecting to database (need to change this when using database of users)
const users = [];
//cors
var corsOptions = {
    origin: "http://localhost:8080"
};

//set the view engine to ejs
app.set('view engine', 'ejs');

//use cors
app.use(cors(corsOptions));
//take forms from "email and password" and access them in our variable in our post method
app.use(express.urlencoded({ extended: false }));
//use flash
app.use(flash());
//use session
app.use(session({
    secret: process.env.SESSION_SECRET, //encrypt our info
    resave: false,
    saveUninitialized: false
}))
//set up passport
app.use(passport.initialize())
//store variables to be persisted across entire session our user has
app.use(passport.session())
//logging out
app.use(methodOverride('_method'))

app.use(express.static('public'))
app.use(express.json());
//use res.render to load up an ejs view file

//for calling database
const db = require("./app/models");
db.sequelize.sync().then(() => {
    console.log("Re-sync db.");
  });

// index page
app.get('/', checkAuthenticated, function(req, res) {
    res.render('pages/index');
});


//login page
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('pages/login')
});
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true //show message to tell them what error they got
}))


//register page
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('pages/register')
});
app.post('/register', checkNotAuthenticated, async (req, res) => {
    // try {
    //     //creates a safe password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userObject = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    }
    axios.post('http://localhost:8080/api/users/register', userObject)
      .then(function (response) {
        if (response.data.email) {
            res.redirect('/login')
        } else {
            res.redirect('/register')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
});


//about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

//logout
app.delete('/logout', (req, res) => {
    //logOut function is setup by passport
    req.logOut()
    res.redirect('/login')
})

//middleware to see if person viewing website is authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
//middleware to see if person viewing website is already authenticated - so they don't go back to login page
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
       return res.redirect('/')
    }
    next()
}


require("./app/routes/tutorial.routes")(app);
require("./app/routes/users.routes")(app, passport);

const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log(`Server is running on port ${PORT}.`);
