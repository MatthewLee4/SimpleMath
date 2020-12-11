if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
//library for loading the things we need
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

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

//local variable instead of connecting to database (need to change this when using database of users)
const users = [];

//set the view engine to ejs
app.set('view engine', 'ejs');

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

app.use(methodOverride('_method'))

//use res.render to load up an ejs view file


// index page
app.get('/', checkAuthenticated, function(req, res) {
    var mascots = [
        { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
        { name: 'Tux', organization: "Linux", birth_year: 1996},
        { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
    ];
    var tagline = "No programming concept is complete without a cute animal mascot.";

    res.render('pages/index', {
        mascots: mascots,
        tagline: tagline
    });
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
    try {
        //creates a safe password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            //this creates a unique id, don't need if have database (which auto generates id)
            id: Date.now().toString(),
            name: req.body.name,
            email:req.body.email,
            password: hashedPassword
        });
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    //to see if user has created account (will reset since this info is not saved into a database)
    console.log(users);
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

app.listen(8080);
console.log('8080 is the magic port');
