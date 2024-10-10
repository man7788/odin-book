const { body, param, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const Profile = require('../models/profileModel');

// Display all user profiles on GET
exports.profile_list = asyncHandler(async (req, res) => {
  const profiles = await Profile.find({
    _id: { $ne: req.user.profile._id },
  }).sort({
    last_name: 1,
  });
  res.json({ profiles });
});

// Display a user profile on GET
exports.profile = [
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

    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    return res.json({ profile });
  }),
];

// Handle user profile update on PUT
exports.profile_update = [
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
  body('about')
    .trim()
    .isLength({ min: 1 })
    .withMessage('About must not be empty')
    .isLength({ max: 200 })
    .withMessage('About exceeded maximum length')
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    if (req.user.profile._id.toString() !== profile._id.toString()) {
      return res.status(400).json({
        error: 'Not allow to update a foreign profile',
      });
    }

    profile.about = req.body.about;

    const updatedProfile = await profile.save();

    return res.json({
      updatedProfile: updatedProfile._id,
    });
  }),
];
