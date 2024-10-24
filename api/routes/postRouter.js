const express = require('express');
const passport = require('passport');

const jwtStrategry = require('../utils/passport/jwt');

passport.use(jwtStrategry);

const router = express.Router();
const postController = require('../controllers/postController');

// POST request for post create
router.post(
  '/',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  postController.post_create,
);

// POST request for post like create
router.post(
  '/:id/likes',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  postController.post_like_create,
);

// POST request for post comment create
router.post(
  '/:id/comments',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  postController.post_comment_create,
);

// GET request for recent posts
router.get(
  '/recent',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  postController.posts_recent,
);

// GET request for all posts of a user
router.get(
  '/users/:id',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  postController.posts_user,
);

module.exports = router;
