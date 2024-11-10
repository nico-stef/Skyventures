const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");

const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next(); // User is authenticated, continue to next middleware
  } else {
    res.status(401).json({ error: "Unauthorized. Please log in." }); // User is not authenticated, redirect to login page
  }
};

router.route("/register").post(authControllers.register);
router.route("/login").post(authControllers.login);
router.route("/logout").get(authControllers.logout);
//router.get('/home', requireAuth, authControllers.home);

module.exports = router;
