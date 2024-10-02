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
  "/likes/create",
  passport.authenticate("jwt", { session: false }),
  postController.post_like_create
);

// POST request for post comment create
router.post(
  "/comments/create",
  passport.authenticate("jwt", { session: false }),
  postController.post_comment_create
);

// GET request for recent posts
router.get(
  "/recent",
  passport.authenticate("jwt", { session: false }),
  postController.posts_recent
);

// GET request for all user posts
router.get(
  "/:profile",
  passport.authenticate("jwt", { session: false }),
  postController.posts_user
);

module.exports = router;
