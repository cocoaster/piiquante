const passwordValidator = require("password-validator");

// Créer un schéma
const passwordSchema = new passwordValidator();

// Ajouter des propriétés au schéma
passwordSchema
  .is()
  .min(8) // Longueur minimale 8
  .is()
  .max(100) // Longueur maximale 100
  .has()
  .uppercase() // Doit contenir des lettres majuscules
  .has()
  .lowercase() // Doit contenir des lettres minuscules
  .has()
  .digits(1) // Doit contenir au moins 1 chiffres
  .has()
  .symbols(1) // Doit contenir au moins 1 symbole
  .has()
  .not()
  .spaces() // Ne doit pas contenir d'espaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Valeurs interdites

module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error: `Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial. ${passwordSchema.validate(
        "req.body.password",
        {details: true}
      )}`,
    });
  }
};
