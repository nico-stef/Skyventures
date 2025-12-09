const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const googlePlacesController = require('../controllers/googlePlacesController');

// Photo endpoint is public (no auth needed for image redirects)
router.route("/photo").get(googlePlacesController.getPlacePhotoUrl);

// Apply authentication middleware to all other routes
router.use(verifyToken);

router.route("/nearby").get(googlePlacesController.getNearbyPlaces);
router.route("/details/:placeId").get(googlePlacesController.getPlaceDetails);
router.route("/search").get(googlePlacesController.searchPlaces);

module.exports = router;
