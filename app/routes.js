const User = require('./models/user.model');

module.exports = function(app,passport){
    app.use((req, res, next) => {
    	app.locals.user = req.user // Récupération de l'objet 'user' (sera existant si une session est ouverte, et undefined dans le cas contraire)
        next()
    })
    
    app.get('/', function(req, res) {
        // res.setHeader('Content-Type', 'text/plain');
        // res.send('hello world');
        res.render('index', { title: 'Hey', message: 'Hello there!'});
    });
    app.get('/register', function(req, res) {
        // res.setHeader('Content-Type', 'text/plain');
        // res.send('hello world');
       
        res.render('register', { 
            title: 'Hey', 
            message: 'Hello there!'});
    });
    app.get('/login', function(req, res) {
        // res.setHeader('Content-Type', 'text/plain');
        // res.send('hello world');
        
        res.render('login', { title: 'Hey',
        message: 'Hello there!'});
        
    });
    app.get('/logout', function(req, res) {
        // res.setHeader('Content-Type', 'text/plain');
        // res.send('hello world');
        req.logout();
        req.flash('danger','déconnecxion réussite')
        res.redirect('/')
        
    });
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', {
    	successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: { message: 'Connexion réussie avec Github. Bienvenue !' }
    }));
     // Lorsqu'on tente de se connecter, c'est le middleware de passport qui prend la main, avec la stratégie "locale" (configurée dans ./passport.js )
     app.post('/login', passport.authenticate('local', {
    	successRedirect: '/',
        failureRedirect: '/login',
        badRequestMessage: 'Identifiants nons valides!',
        failureFlash: true,
        successFlash: { message: 'Connexion réussie. Bienvenue !' }
    }));
    app.post('/signup', function(req, res) {
        // res.setHeader('Content-Type', 'text/plain');
        // res.send('hello world');
        //console.log(req.body);
        User.signup(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password,
            req.body.passConfirmation,
        ).then(() => {//danger
            req.flash('success','inscription réussite')
            res.redirect('/')
        })
        .catch(errors => {
            res.render('register',{errors,user:req.body})
            
        })
    });
}