// const mongoose=require('mongose');
// const Schema = mongoose.Schema;
// const mySchema = new Schema({
//     firstname: String,
//     lastname: String,
//     email: String,
//     hash: String,
//     salt: String,
//   });
//   const myModel=mongoose.model('Model',mySchema);
//   module.exports = {myModel}
// Utilisation du module npm 'mongoose'
const mongoose = require('mongoose');
const hash = require('./../hash')
// DÃ©finition du "SchÃ©ma" d'un utilisateur
const UserSchema = mongoose.Schema({
	firstname : { type: String,required:true },
	lastname : { type: String,required:true},
    
    // Validateur personnalisÃ© qui vÃ©rifie le format d'une adresse e-mail.
    // BasÃ© sur la documentation de mongoose : http://mongoosejs.com/docs/validation.html#custom-validators 
    email : {
        type: String,
        required:true,
        validate: {
            validator: function(mailValue) {
                // c.f. http://emailregex.com/
                const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegExp.test(mailValue);
            },
            message: 'L\'adresse email {VALUE} n\'est pas une adresse RFC valide.'
        }
    },

    salt: { type: String},
    hash: { type: String },
    githubid : { type: String },
    

});
UserSchema.statics.signup = function(firstname,lastname,email,pass,pass_confirmation){
    const pass_errors = []

    if (pass.trim() === '')
        pass_errors.push('Le champs "mot de passe" est obligatoire')

    if (pass_confirmation.trim() === '')
        pass_errors.push('Le champs "confirmation de mot de passe" est obligatoire')

    if (pass_errors.length === 0 && pass.trim() !== pass_confirmation.trim())
        pass_errors.push('Les mots de passe doivent être identiques')

    if (pass_errors.length > 0)
        return Promise.reject(pass_errors)
  
        /*
        Insertion en base, en utilisant la méthode .create() de d'un Model mongoose
        c.f. http://mongoosejs.com/docs/api.html#create_create

        Cette méthode renvoie une Promesse JS. Avec l'instruction 'return', on renvoie donc
        la promesse comme valeur de 'UserSchema.statics.signup'
    */
    
    return this.findOne({ email: email })
    .then(user => {
        if (user)
            return Promise.reject(new Error(`Cette adresse email est déjà utilisée (${user.email})`));
    })
    .then(() => hash(pass))
    .then( ({salt, hash}) => {
    return this.create({
        firstname : firstname,
        lastname : lastname,
        email : email,
        salt : salt,
        hash : hash
    })
}).catch(err => {
    // Fabrication d'un tableau de messages d'erreur (extraits de l'objet 'ValidationError' renvoyé par Mongoose)
    if (err.errors)
        throw Object.keys(err.errors).map(field => err.errors[field].message);
    
    throw [err.message ? err.message : err];
})

};
UserSchema.statics.verifyPass = function(passwordInClear, userObject) {
	const usersalt = userObject.salt;
    const userhash = userObject.hash;
    
    return hash(passwordInClear, usersalt).then((data) => {
    	if (data.hash === userhash) {
        	return Promise.resolve(userObject)
        } else {
        	return Promise.reject(new Error('Mot de passe invalide!'))
        }
    });
}


// Export du ModÃ¨le mongoose reprÃ©sentant un objet User
module.exports = mongoose.model('User', UserSchema);