const express = require("express");
const router = express.Router();

const usersControllers = require("../controllers/users");
const password = require("../middleware/password");

router.post("/signup", password, usersControllers.signup);
router.post("/login", usersControllers.login);

module.exports = router;
