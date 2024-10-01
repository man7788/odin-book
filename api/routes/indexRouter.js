const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

const passport = require("passport");
const jwtStrategry = require("../utils/passport/jwt");
passport.use(jwtStrategry);

// GET request for index
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  indexController.index
);

// POST request for user sign-up
router.post("/signup", indexController.sign_up);

// POST request for user log-in
router.post("/login", indexController.log_in);

// POST request for user profile
router.get("/:profile", indexController.profile);

module.exports = router;
