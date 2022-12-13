const Sauce = require('../models/saucemodel')
const fs = require('fs')


exports.GetAllObjet = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces)) 
        .catch(error => res.status(400).json({ error }));
}
exports.CreateNewObjects = (req, res, next) => {
    const SauceObject = JSON.parse(req.body.sauce)
    delete SauceObject._id
    delete SauceObject._userId
    const sauce = new Sauce({
        ...SauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Registered item !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.GetOneObjet = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json( sauce ))  
        .catch(error => res.status(404).json({ error }));
}


exports.ModifyObjet = (req, res, next) => {
    const SauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    delete SauceObject._userId
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'unauthorized request.' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...SauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};


exports.DeleteObjet = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Item deleted !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};


exports.like = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let Likes = req.body.like 
            let userId = req.body.userId
            let message = ""
            if(Likes === 1){
                sauce.usersLiked.push(userId)
                message = 'likes'
            }else if(Likes === -1){
                sauce.usersDisliked.push(userId)
                message = 'Dislikes'
            }else if(Likes === 0){
                if(sauce.usersLiked.includes(userId)){
                    const userIdIndex = sauce.usersLiked.indexOf(userId)
                    sauce.usersLiked.splice(userIdIndex, 1)
                    message = 'like cancelled !'
                }
                if (sauce.usersDisliked.includes(userId)) {
                    const userIdIndex = sauce.usersDisliked.indexOf(userId)
                    sauce.usersDisliked.splice(userIdIndex, 1)
                    message = 'Dislike cancelled !'
                }
            }
            sauce.likes = sauce.usersLiked.length
            sauce.Disliked = sauce.usersDisliked.length
            sauce.save()
                .then(() => { res.status(200).json({ message: `The user has ${message}`}) })
                .catch(error => res.status(401).json({ error }))
        })
        .catch(error => {
            res.status(500).json({ error });
        });

}