const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwtStrategry = require("../utils/passport/jwt");
passport.use(jwtStrategry);

const followerController = require("../controllers/followerController");

// POST request for follower request create
router.post(
  "/requests/create",
  passport.authenticate("jwt", { session: false }),
  followerController.request_create
);

module.exports = router;
