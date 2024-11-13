const express = require("express");
const router = express.Router();
const favoriteControllers = require('../controllers/favoritesControllers');

router.route("/add").post(favoriteControllers.addToFavorites);
router.route("/:userId").get(favoriteControllers.getFavorites);

module.exports = router;