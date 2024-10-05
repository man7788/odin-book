const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwtStrategry = require("../utils/passport/jwt");
passport.use(jwtStrategry);

const followerController = require("../controllers/followerController");

// POST request for follower request create
router.post(
  "/requests",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  followerController.request_create
);

// GET request for all follower requests received
router.get(
  "/requests",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  followerController.requests_received
);

// GET request for all pending follower requests
router.get(
  "/requests/pending",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  followerController.requests_pending
);

// POST request for follower request accept
router.post(
  "/",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  followerController.request_accept
);

module.exports = router;
