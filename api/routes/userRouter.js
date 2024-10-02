const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwtStrategry = require("../utils/passport/jwt");
passport.use(jwtStrategry);

const userController = require("../controllers/userController");

// PUT request for profile update
router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile_update
);

module.exports = router;
