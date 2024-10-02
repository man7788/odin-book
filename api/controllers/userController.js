const { body, param, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Profile = require("../models/profileModel");

// Handle user profile update on PUT
exports.profile_update = [
  body("about")
    .trim()
    .isLength({ min: 1 })
    .withMessage("About must not be empty")
    .isLength({ max: 200 })
    .withMessage("About exceeded maximum length")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      const profile = await Profile.findById(req.user.profile);

      profile.about = req.body.about;

      const updatedProfile = await profile.save();

      res.json({ updatedProfile });
    }
  }),
];
