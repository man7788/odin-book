const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

const passport = require("passport");
const jwtStrategry = require("../utils/passport/jwt");
passport.use(jwtStrategry);

// POST request for post create
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  postController.post_create
);

// POST request for post like create
router.post(
  "/like",
  passport.authenticate("jwt", { session: false }),
  postController.post_like
);

module.exports = router;
