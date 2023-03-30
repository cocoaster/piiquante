const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");

const express = require("express");
const dotenv = require("dotenv");
const saucesRoutes = require("./routes/sauces");
const usersRoutes = require("./routes/users");
const fs = require("fs");

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};
const app = express();

app.use(cors(corsOptions));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "http://localhost:4200"],
      connectSrc: ["'self'", "http://localhost:3000", "ws://localhost:4200"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      blockAllMixedContent: [],
      frameAncestors: ["'none'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
    reportOnly: false,
    setAllHeaders: false,
    disableAndroid: false,
    browserSniff: true,
  })
);

const morgan = require("morgan");
const path = require("path");

app.use(express.json());
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const user = mongoose.model("User", userSchema);
mongoose.set("strictQuery", false);
//
dotenv.config();

const uri = process.env.STRING_URI;

mongoose
  .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", usersRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(morgan("dev"));

module.exports = app;
