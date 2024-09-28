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

module.exports = router;
