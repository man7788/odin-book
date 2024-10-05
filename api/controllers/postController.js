const { body, param, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Profile = require("../models/profileModel");
const Post = require("../models/postModel");
const Follower = require("../models/followerModel");
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
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      const post = new Post({
        profile: req.user.profile._id,
        author: req.user.profile.full_name,
        text_content: req.body.text_content,
      });

      const createdPost = await post.save();

      res.json({ createdPost: createdPost._id });
    }
  }),
];

// Handle post like create on POST
exports.post_like_create = [
  param("id")
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
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).json({
          error: "Post not found",
        });
      }

      const alreadyLiked = await Like.findOne({
        post: req.params.id,
        profile: req.user.profile,
      });

      if (alreadyLiked) {
        const removedLike = await Like.findByIdAndDelete(alreadyLiked._id);
        return res.json({
          removedLike: removedLike._id,
        });
      }

      const like = new Like({
        post: post._id,
        profile: req.user.profile,
        author: req.user.profile.full_name,
      });

      const createdLike = await like.save();

      res.json({
        createdLike: createdLike._id,
      });
    }
  }),
];

// Handle post comment create on POST
exports.post_comment_create = [
  param("id")
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
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).json({
          error: "Post not found",
        });
      }
      const comment = new Comment({
        post: post._id,
        profile: req.user.profile,
        author: req.user.profile.full_name,
        text_content: req.body.text_content,
      });

      const createdComment = await comment.save();

      res.json({
        createdComment: createdComment._id,
      });
    }
  }),
];

// Display recent posts on GET
exports.posts_recent = asyncHandler(async (req, res, next) => {
  const followers = await Follower.find({ follower: req.user.profile });
  const followings = [];

  for (const follower of followers) {
    followings.push(follower.following);
  }

  const posts = await Post.find({
    profile: { $in: [...followings, req.user.profile] },
  })
    .sort({ createdAt: -1 })
    .limit(20);
  const recentPosts = [];

  for (const post of posts) {
    const postWithLikesComments = {
      profile: post.profile,
      author: post.author,
      text_content: post.text_content,
    };

    const likes = await Like.find({ post: post._id });
    const comments = await Comment.find({ post: post._id });

    postWithLikesComments.likes = likes;
    postWithLikesComments.comments = comments;

    recentPosts.push(postWithLikesComments);
  }

  res.json({ recentPosts });
});

// Display all user posts on GET
exports.posts_user = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({
    profile: req.user.profile,
  }).sort({ createdAt: -1 });

  const userPosts = [];

  for (const post of posts) {
    const postWithLikesComments = {
      profile: post.profile,
      author: post.author,
      text_content: post.text_content,
    };

    const likes = await Like.find({ post: post._id });
    const comments = await Comment.find({ post: post._id });

    postWithLikesComments.likes = likes;
    postWithLikesComments.comments = comments;

    userPosts.push(postWithLikesComments);
  }

  res.json({ userPosts });
});
