const passwordValidator = require('password-validator')

let passWordschema = new passwordValidator()

// Add properties to it
passWordschema
    .is().min(5) // Longueur minimale 5
    .is().max(100) // Longueur maximale 100 
    .has().uppercase() // Doit contenir des lettres majuscules 
    .has().lowercase() // Doit contenir des lettres minuscules 
    .has().digits(2) // Doit avoir au moins 2 chiffres 
    .has().not().spaces() // Ne doit pas avoir d'espaces 
    .is().not().oneOf(['Passw0rd', 'Password123']) // Liste noire ces valeurs

    module.exports = (req, res, next) =>{
        if(passWordschema.validate(req.body.password)){
            next()
        }else{
            return res
            .status(400)
                .json({ error : "your password is not strong enough ! :" + passWordschema.validate('req.body.password', {list: true})})
        }
    }
//.json({ error : `your password is not strong enough ! ${passWordschema.validate('req.body.password', {list: true})}`})