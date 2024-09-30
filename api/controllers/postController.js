const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Profile = require("../models/profileModel");
const Post = require("../models/postModel");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");

// Handle post create on POST
exports.post_create = [
  body("text_content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content must not be empty")
    .isLength({ max: 280 })
    .withMessage("Content exceeded maximum length")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
    } else {
      const profile = await Profile.findOne(req.user.profile);

      if (!profile) {
        res.json(null);
      } else {
        const post = new Post({
          profile: profile._id,
          author: profile.full_name,
          text_content: req.body.text_content,
        });

        const createdPost = await post.save();

        res.json({ createdPost: createdPost._id });
      }
    }
  }),
];

// Handle post like on POST
exports.post_like = [
  body("post_id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Post id must not be empty")
    .custom((value) => {
      const validId = mongoose.isValidObjectId(value);
      if (!validId) {
        throw new Error("Invalid post ID");
      }
      return validId;
    })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
    } else {
      const post = await Post.findById(req.body.post_id);
      const alreadyLiked = await Like.findOne({ post: req.body.post_id });
      const profile = await Profile.findOne(req.user.profile);

      if (!post || alreadyLiked) {
        res.json(null);
      } else {
        const like = new Like({
          post: req.body.post_id,
          profile: req.user.profile,
          author: profile.full_name,
        });

        const createdLike = await like.save();

        res.json({
          createdLike: createdLike._id,
        });
      }
    }
  }),
];

// Handle post comment create like on POST
exports.post_comment_create = [
  body("post_id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Post id must not be empty")
    .custom((value) => {
      const validId = mongoose.isValidObjectId(value);
      if (!validId) {
        throw new Error("Invalid post ID");
      }
      return validId;
    })
    .escape(),
  body("text_content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content must not be empty")
    .isLength({ max: 280 })
    .withMessage("Content exceeded maximum length")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
    } else {
      const post = await Post.findById(req.body.post_id);
      const profile = await Profile.findOne(req.user.profile);

      if (!post) {
        res.json(null);
      } else {
        const comment = new Comment({
          post: req.body.post_id,
          profile: req.user.profile,
          author: profile.full_name,
          text_content: req.body.text_content,
        });

        const createdComment = await comment.save();

        res.json({
          createdComment: createdComment._id,
        });
      }
    }
  }),
];
