const { body, param, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Request = require('../models/requestModel');
const Follower = require('../models/followerModel');
const Profile = require('../models/profileModel');

// Handle follower request create on POST
exports.request_create = [
  body('following_id')
    .trim()
    .notEmpty()
    .withMessage('Following user id must not be empty')
    .bail()
    .custom((value) => {
      const validId = mongoose.isValidObjectId(value);
      if (!validId) {
        throw new Error('Invalid following user id');
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

    const followingProfile = await Profile.findById(req.body.following_id);

    if (!followingProfile) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    const alreadyFollowing = await Follower.findOne({
      follower: req.user.profile._id,
      following: req.body.following_id,
    });

    if (alreadyFollowing) {
      return res.status(400).json({
        error: 'Already following',
      });
    }

    const pendingRequest = await Request.findOne({
      from: req.user.profile._id,
      to: req.body.following_id,
    });

    if (pendingRequest) {
      return res.status(400).json({
        error: 'Request pending',
      });
    }

    const request = new Request({
      from: req.user.profile._id,
      to: req.body.following_id,
    });

    const createdRequest = await request.save();

    return res.json({ createdRequest: createdRequest._id });
  }),
];

// Display all follower requests received on GET
exports.requests_received = asyncHandler(async (req, res) => {
  const requests = await Request.find({ to: req.user.profile._id });

  res.json({ requests });
});

// Display all pending follower requests on GET
exports.requests_pending = asyncHandler(async (req, res) => {
  const requests = await Request.find({ from: req.user.profile._id });

  res.json({ requests });
});

// Handle check single following user on GET
exports.check_following_single = [
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

    const alreadyFollowing = await Follower.findOne({
      follower: req.user.profile._id,
      following: req.params.id,
    });

    if (alreadyFollowing) {
      return res.json({ following: true });
    }

    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    const currentProfile =
      req.params.id.toString() === req.user.profile._id.toString();

    if (currentProfile) {
      return res.json({ currentUser: true });
    }

    const pendingRequest = await Request.findOne({
      from: req.user.profile._id,
      to: req.params.id,
    });

    if (pendingRequest) {
      return res.json({ pending: true });
    }

    return res.json({ following: false });
  }),
];

// Handle follower request accept on POST
exports.request_accept = [
  body('request_id')
    .trim()
    .notEmpty()
    .withMessage('Request id must not be empty')
    .bail()
    .custom((value) => {
      const validId = mongoose.isValidObjectId(value);
      if (!validId) {
        throw new Error('Invalid request id');
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

    const request = await Request.findOne({
      _id: req.body.request_id,
      to: req.user.profile._id,
    });

    if (!request) {
      return res.status(400).json({
        error: 'Request not found',
      });
    }

    const follower = new Follower({
      follower: request.from,
      following: request.to,
    });

    const createdFollower = await follower.save();
    await request.deleteOne();

    return res.json({ createdFollower: createdFollower._id });
  }),
];
