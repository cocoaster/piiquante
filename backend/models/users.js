const mongoose = require("mongoose");
const arrayUniquePlugin = require("mongoose-unique-array");

// // Valider un mot de passe
// const password = "UnMotDePasseValide123";

const usersSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {
    type: String,
    required: true,
  },
});

usersSchema.plugin(arrayUniquePlugin);

module.exports = mongoose.model("Users", usersSchema);
