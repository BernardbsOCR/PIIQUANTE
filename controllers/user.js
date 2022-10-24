const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('password-validator');

var schemaPassword = new validator();

function checkPassWord(password) {
    const valid = false;

    schemaPassword.is().min(4);

    schemaPassword
    .is().min(8)
    .is().max(30)  
    .has().digits(1)
    .has().uppercase()
    .has().lowercase()    
    .has().not().spaces();

    return schemaPassword.validate(password);
}

module.exports.signup = (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    const emailValidator = /^\w+([\._]?\w)*\w@+([\._]?\w)*\.(\w{2,3})+$/;

    if (!checkPassWord(password)) {
        console.log('mot de pass invalide');
        res.status(400).json({ error: 'Mot de pass invalide' });
    }
    else if (!email.match(emailValidator)) {
        console.log('email invalide');
        res.status(400).json({ error: 'Email invalide' });
    }
    else {
        bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
    
            console.log("signup : hash : " + user.email);
    
            user.save()
            .then(() => {
                res.status(201).json({ message: 'Utilisateur créé' });
            })
            .catch(error => {
                res.status(401).json({error});
            })
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    }
}

module.exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null) {
            res.status(401).json({error : 'Paire login/mot de passe incorrecte'});
        }
        else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message: 'Paire login/mot de passe incorrecte'});
                }
                else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({userId: user._id}, 'RANDOM_SECRET_KEY', {expiresIn: '24h'})
                    })
                }
            })
            .catch(error => res.status(500).json({error}));
        }
    })
    .catch(error => res.statut(500).json({error}));
}