const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwtStrategry = require("../utils/passport/jwt");
passport.use(jwtStrategry);

const userController = require("../controllers/userController");

//GET request for a user profile
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  userController.profile
);

// GET request for all user profiles
router.get(
  "/",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  userController.profile_list
);

// PUT request for user profile update
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  userController.profile_update
);

module.exports = router;
