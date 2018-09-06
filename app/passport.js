const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github').Strategy;

const User = require('./models/user.model')

module.exports = function (passport) {
    const localStrategyConfig = {
        usernameField: 'email', // en fonction du name="" du champs input type text
        passwordField: 'password'
    };

    passport.use(new LocalStrategy(localStrategyConfig, (email, password, done) => {
        /*on vérifier ici identifiant de notre utilisateur 
        s il sont bon ,on redonne la main à la passport avec ctte ligne
        en cas de probléme,on redonne la à passport avec:
        ENGINE_METHOD_NONE(null,false,message:err.mesg)*/
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    done(null, false, { message: 'Adresse email invalide' })
                    return Promise.reject()
                } return user;
            }) 
            .then(user => User.verifyPass(password, user)
                .then(user => {
                    done(null, user);
                })
                .catch(err => {
                    if (err)
                        done(null, false, { message: err.message });
                }));

    }));

}
