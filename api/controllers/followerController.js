const asyncHandler = require("express-async-handler");
const Request = require("../models/requestModel");
const Follower = require("../models/followerModel");
const Profile = require("../models/profileModel");

// Handle friend request create on POST
exports.request_create = asyncHandler(async (req, res, next) => {
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
});
