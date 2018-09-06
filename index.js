
require("dotenv").config();
const express = require('express');
const port = 8080;
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')//package pour l'identification
app.set('view engine', 'pug');
app.set('views', './views')

// configuratoin des middelwares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'opendata3wa rocks',
    resave: false, saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(flash());
app.use((req,res,next) => {
    //Middleware perso
    app.locals.flashMessages = req.flash()
    next()
    
})
app.use(passport.initialize())
app.use(passport.session())



//configuratoin des routes
require('./app/passport')(passport);
require('./app/routes')(app, passport);
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`, { useNewUrlParser: true })
    // mongoose.connect('mongodb://data:&aqw&AQW1@ds245132.mlab.com:45132/data', { useNewUrlParser: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`vous etes connecter sur lacalhost /8080`)
        })
    });
