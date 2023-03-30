const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../images/multer-config.js");

sauceControllers = require("../controllers/sauces.js");

router.get("/", auth, sauceControllers.getAllSauces);
router.post("/", auth, multer, sauceControllers.createSauce);
router.get("/:id", auth, sauceControllers.getOneSauce);
router.put("/:id", auth, multer, sauceControllers.modifySauce);
router.delete("/:id", auth, sauceControllers.deleteSauce);
router.post("/:id/like", auth, sauceControllers.like);

module.exports = router;
