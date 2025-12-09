const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const weatherController = require('../controllers/weatherController');

router.use(verifyToken);

router.route("/current").get(weatherController.getCurrentWeather);

module.exports = router;
