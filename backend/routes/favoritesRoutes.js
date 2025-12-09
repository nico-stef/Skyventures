const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const favoriteControllers = require('../controllers/favoritesControllers');

// Apply authentication middleware to all routes
router.use(verifyToken);

router.route("/add").post(favoriteControllers.addToFavorites);
router.route("/").get(favoriteControllers.getFavorites);
router.route("/delete").delete(favoriteControllers.deleteFavorite);

module.exports = router;