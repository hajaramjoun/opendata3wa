const User = require('./models/user.model');

module.exports = function(app){
    app.get('/', function(req, res) {
        // res.setHeader('Content-Type', 'text/plain');
        // res.send('hello world');
        res.render('index', { title: 'Hey', message: 'Hello there!'});
    });
    app.get('/login', function(req, res) {
        // res.setHeader('Content-Type', 'text/plain');
        // res.send('hello world');
        res.render('login', { 
            title: 'Hey', 
            message: 'Hello there!'});
    });
    app.get('/register', function(req, res) {
        // res.setHeader('Content-Type', 'text/plain');
        // res.send('hello world');
        res.render('register', { title: 'Hey', message: 'Hello there!'});
    });
    app.post('/login', function(req, res) {
        // res.setHeader('Content-Type', 'text/plain');
        // res.send('hello world');
        //console.log(req.body);
        User.signup(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password,
            req.body.passConfirmation,
        ).then(() => {
            res.redirect('/?signup=ok')
        }).catch(errors => {
            res.render("login.pug",{ errors, user: req.body })
        })
    });
}