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

// GET request for all follower requests received
router.get(
  "/requests/received",
  passport.authenticate("jwt", { session: false }),
  followerController.requests_received
);

// GET request for all follower requests sent
router.get(
  "/requests/sent",
  passport.authenticate("jwt", { session: false }),
  followerController.requests_sent
);

// POST request for follower request accept
router.post(
  "/requests/accept",
  passport.authenticate("jwt", { session: false }),
  followerController.request_accept
);

module.exports = router;
