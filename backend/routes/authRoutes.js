const express = require("express");
const authControllers = require("../controllers/authControllers");
const router = express.Router();

router.route("/register").get(authControllers.register);
router.route("/login").get(authControllers.login);

module.exports = router;