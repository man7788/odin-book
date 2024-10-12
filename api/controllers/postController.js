const { body, param, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Profile = require('../models/profileModel');
const Post = require('../models/postModel');
const Follower = require('../models/followerModel');
const Like = require('../models/likeModel');
const Comment = require('../models/commentModel');

// Handle post create on POST
exports.post_create = [
  body('text_content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content must not be empty')
    .isLength({ max: 280 })
    .withMessage('Content exceeded maximum length')
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const post = new Post({
      profile: req.user.profile._id,
      author: req.user.profile.full_name,
      text_content: req.body.text_content,
    });

    const createdPost = await post.save();

    return res.json({ createdPost: createdPost._id });
  }),
];

// Handle post like create on POST
exports.post_like_create = [
  param('id')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Post id must not be empty')
    .custom((value) => {
      const validId = mongoose.isValidObjectId(value);
      if (!validId) {
        throw new Error('Invalid post ID');
      }
      return validId;
    })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({
        error: 'Post not found',
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

    return res.json({
      createdLike: createdLike._id,
    });
  }),
];

// Handle post comment create on POST
exports.post_comment_create = [
  param('id')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Post id must not be empty')
    .custom((value) => {
      const validId = mongoose.isValidObjectId(value);
      if (!validId) {
        throw new Error('Invalid post ID');
      }
      return validId;
    })
    .escape(),
  body('text_content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content must not be empty')
    .isLength({ max: 280 })
    .withMessage('Content exceeded maximum length')
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({
        error: 'Post not found',
      });
    }
    const comment = new Comment({
      post: post._id,
      profile: req.user.profile,
      author: req.user.profile.full_name,
      text_content: req.body.text_content,
    });

    const createdComment = await comment.save();

    return res.json({
      createdComment: createdComment._id,
    });
  }),
];

// Display recent posts on GET
exports.posts_recent = asyncHandler(async (req, res) => {
  // Return an array of following users profile id
  const followings = await Follower.distinct('following', {
    follower: req.user.profile._id,
  });

  // Return an array of posts with likes and comments
  const posts = await Post.aggregate([
    {
      $match: {
        profile: {
          $in: [...followings, req.user.profile._id],
        },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'post',
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'post',
        as: 'comments',
      },
    },
  ]);

  res.json({ posts });
});

// Display all posts of a user on GET
exports.posts_user = [
  param('id')
    .trim()
    .isLength({ min: 1 })
    .withMessage('User id must not be empty')
    .custom((value) => {
      const validId = mongoose.isValidObjectId(value);
      if (!validId) {
        throw new Error('Invalid user ID');
      }
      return validId;
    })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Verify user profile exists in database
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    // Return an array of posts with likes and comments
    const posts = await Post.aggregate([
      {
        $match: {
          profile: profile._id,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
    ]);

    return res.json({ posts });
  }),
];
