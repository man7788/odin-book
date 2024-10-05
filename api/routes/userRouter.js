const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwtStrategry = require("../utils/passport/jwt");
passport.use(jwtStrategry);

const userController = require("../controllers/userController");

// GET request for all user profiles
router.get(
  "/",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  userController.profile_list
);

//GET request for a user profile
router.get(
  "/:profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);

// PUT request for user profile update
router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile_update
);
module.exports = router;
