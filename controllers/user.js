const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
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