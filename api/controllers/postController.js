const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Profile = require("../models/profileModel");
const Post = require("../models/postModel");

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
      const profile = Profile.findOne(req.user.profile);

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
