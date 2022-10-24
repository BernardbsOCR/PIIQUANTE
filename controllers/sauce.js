const Sauce = require('../models/Sauce');
const fs = require('fs');
const path = require('path');
const { resourceLimits } = require('worker_threads');

module.exports.findAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => {
        res.status(200).json(sauces);
    })
    .catch(error => {
        res.status(500).json({ error });
    });
}

module.exports.findOneSauce = (req, res, next) => {
    const sauceId = req.params.id;

    Sauce.findOne({ _id: sauceId })
    .then(sauce => {
        res.status(200).json(sauce);
    })
    .catch(error => {
        res.status(404).json({ error });
    })
}

module.exports.createSauce = (req, res, next) => {
    const reqSauce = JSON.parse(req.body.sauce);    

    const userId = req.auth.userId;
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    if (reqSauce.userId !== userId) {
        res.status(403).json({ message : 'Forbidden' });
    }
    else {
        delete reqSauce.userId;

        const sauce = new Sauce({
            ...reqSauce,
            userId: userId,
            imageUrl: imageUrl,
            likes: 0,
            dislikes : 0,
            usersLiked: [],
            usersDisliked : []
        });

        sauce.save()
        .then(() => {
            res.status(201).json({ message: 'Sauce created!' })
        })
        .catch(error => {
            res.status(400).json({ error })
        });
    }
}

module.exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject.userId;

    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const userId = req.auth.userId;

        if ( userId !== sauce.userId) {
            res.status(403).json({ message: 'Forbidden' });
        }
        else {
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];

                fs.unlink(`images/${filename}`, () => {
                    updateSauce(res, sauceObject, req.params.id);
                });
            }
            else {
                updateSauce(res, sauceObject, req.params.id);
            }
        }
    })
    .catch(error => {
        req.status(500).json({ error });
    });
}

function updateSauce(res, sauceObject, sauceId) {
    Sauce.updateOne({ _id: sauceId }, { ...sauceObject, _id:sauceId })
    .then(() => {
        res.status(200).json({ message : "Updated" });
    })
    .catch(error => {
        res.status(500).json({ error });
    })
}

module.exports.deleteSauce = (req, res, next) => {
    const sauceId = req.params.id;

    Sauce.findOne({ _id: sauceId })
    .then(sauce => {
        userId = req.auth.userId;

        if (sauce.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
        }
        else {
            const filename = sauce.imageUrl.split('/images/')[1];

            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _is: sauceId })
                .then(() => {
                    res.status(200).json({ message : "Sauce deleted" })
                })
                .catch(error => {
                    res.status(500).json({ error });
                }); 
            });
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    })
}

module.exports.modifyLike = (req, res, next) => {   
    const user = {...req.body};    

    if (user.userId !== req.auth.userId) {
        res.status(403).json({ message: 'Not Authorized!'})
    }
    else {
        const sauceId = req.params.id;

        Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            const sauceObject = getSauceObject(sauce._doc, user);

            Sauce.updateOne({ _id: sauceId }, {...sauceObject, _id: sauceId})
            .then(() => {
                res.status(200).json({ message: 'Liked Updated'});
            })
            .catch(error => {
                res.status(500).json({ error });
            });
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    }    
}

function getSauceObject(sauceObject, user) {
    switch (user.like) {
        case 0:
            if (isUserPresent(sauceObject.usersLiked, user.userId)) {
                sauceObject.likes -= 1;                           
                sauceObject.usersLiked = sauceObject.usersLiked.filter(id => id != user.userId);
            }
            else if (isUserPresent(sauceObject.usersDisliked, user.userId)) {
                sauceObject.dislikes -= 1;             
                sauceObject.usersDisliked = sauceObject.usersDisliked.filter(id => id != user.userId);
            }
            break;
        case 1:
            sauceObject.likes += 1;
            sauceObject.usersLiked.push(user.userId); 
            break;
        case -1:
            sauceObject.dislikes += 1;
            sauceObject.usersDisliked.push(user.userId);          
    }     

    return sauceObject;
}

function isUserPresent(users, curentUserId) {
    if (!users.length) {        
        return false;
    }
    else if (users.find(userId => userId === curentUserId)) {
        return true
    }
    return false;
}
