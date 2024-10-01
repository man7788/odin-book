const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Request = require("../models/requestModel");
const Follower = require("../models/followerModel");
const Profile = require("../models/profileModel");

// Handle follower request create on POST
exports.request_create = [
  body("following_id")
    .trim()
    .notEmpty()
    .withMessage("Following user id must not be empty")
    .bail()
    .custom((value) => {
      const validId = mongoose.isValidObjectId(value);
      if (!validId) {
        throw new Error("Invalid following user id");
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
      const followingProfile = await Profile.findById(req.body.following_id);

      if (!followingProfile) {
        res.json(null);
      } else {
        const profile = await Profile.findById(req.user.profile);

        const follower = await Follower.findOne({
          follower: profile._id,
          following: req.body.following_id,
        });

        const request = await Request.findOne({
          from: profile._id,
          to: req.body.following_id,
        });

        if (follower || request) {
          res.json(null);
        } else {
          const request = new Request({
            from: profile._id,
            to: req.body.following_id,
          });

          const createdRequest = await request.save();

          res.json({ createdRequest: createdRequest._id });
        }
      }
    }
  }),
];

// Display all follower requests create on GET
exports.requests = asyncHandler(async (req, res, next) => {
  const requests = await Request.find({ to: req.user.profile });

  res.json({ requests });
});

// Handle follower request accept on POST
exports.request_accept = [
  body("request_id")
    .trim()
    .notEmpty()
    .withMessage("Request id must not be empty")
    .bail()
    .custom((value) => {
      const validId = mongoose.isValidObjectId(value);
      if (!validId) {
        throw new Error("Invalid request id");
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
      const request = await Request.findById(req.body.request_id);

      if (!request) {
        res.json(null);
      } else {
        const follower = new Follower({
          follower: request.from,
          following: request.to,
        });

        const createdFollower = await follower.save();
        await request.deleteOne();

        res.json({ createdFollower });
      }
    }
  }),
];
