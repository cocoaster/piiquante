const Sauces = require("../models/sauces");
const fs = require("fs");

exports.like = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;

  // Get the sauce to be liked or disliked
  Sauces.findOne({_id: req.params.id})
    .then((sauce) => {
      if (!sauce) {
        throw new Error("Sauce not found");
      }
      let message = "";
      let status = 200;
      let userLikedSauce = sauce.usersLiked.includes(userId);
      let userDislikedSauce = sauce.usersDisliked.includes(userId);

      if (like === 1) {
        // User liked the sauce
        if (userLikedSauce) {
          // User already liked the sauce
          message = "You have already liked this sauce";
        } else {
          // User has not yet liked the sauce
          sauce.likes += 1;
          sauce.usersLiked.push(userId);

          // If user had previously disliked the sauce, remove the dislike
          if (userDislikedSauce) {
            sauce.dislikes -= 1;
            sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
            message = "You changed your dislike to like";
          } else {
            message = "You liked the sauce";
          }
        }
      } else if (like === -1) {
        // User disliked the sauce
        if (userDislikedSauce) {
          // User already disliked the sauce
          message = "You have already disliked this sauce";
        } else {
          // User has not yet disliked the sauce
          sauce.dislikes += 1;
          sauce.usersDisliked.push(userId);

          // If user had previously liked the sauce, remove the like
          if (userLikedSauce) {
            sauce.likes -= 1;
            sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
            message = "You changed your like to dislike";
          } else {
            message = "You disliked the sauce";
          }
        }
      } else if (like === 0) {
        // User cancelled the vote
        if (userLikedSauce) {
          // User cancelled the like
          sauce.likes -= 1;
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
          message = "You cancelled your like";
        } else if (userDislikedSauce) {
          // User cancelled the dislike
          sauce.dislikes -= 1;
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
          message = "You cancelled your dislike";
        }
      } else {
        throw new Error("Invalid like value");
      }

      // Update the sauce in the database
      Sauces.updateOne({_id: req.params.id}, sauce)
        .then(() => {
          res.status(status).json({message: message});
        })
        .catch((error) => {
          res.status(400).json({error: error});
        });
    })
    .catch((error) => {
      res.status(404).json({error: error});
    });
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauces({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({message: "Votre sauce a bien été enregistrée !"});
    })
    .catch((error) => {
      res.status(400).json({error});
    });
};

exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauces.findOne({_id: req.params.id})
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${filename}`);
      })
      .catch((error) => res.status(500).json({error}));
  }
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {...req.body};

  Sauces.findOne({_id: req.params.id})
    .then((sauce) => {
      if (sauce.userId === req.userId) {
        Sauces.updateOne(
          {_id: req.params.id},
          {...sauceObject, _id: req.params.id}
        )
          .then(() => res.status(200).json({message: "Sauce modified!"}))
          .catch((error) => res.status(400).json({error}));
      } else {
        res.status(401).json({error: "Unauthorized user"});
      }
    })
    .catch((error) => res.status(500).json({error}));
};

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({_id: req.params.id})
    .then((sauce) => {
      if (sauce.userId === req.body.userId) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: "Sauce supprimée !"}))
            .catch((error) => res.status(400).json({error}));
        });
      } else {
        res.status(403).json({error: "Unauthorized"});
      }
    })
    .catch((error) => res.status(500).json({error}));
};

exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({_id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({error}));
};

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({error}));
};


