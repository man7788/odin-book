const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Display index on GET
exports.index = asyncHandler(async (req, res) => {
  const profile = await Profile.findById(req.user.profile);
  res.json({ full_name: profile.full_name });
});

// Handle sign-up on POST
exports.sign_up = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isLength({ max: 320 })
    .withMessage("Email exceeded maximum length")
    .isEmail()
    .withMessage("Email format is invalid")
    .bail()
    .escape()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already in use");
      }
    }),
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name must not be empty")
    .isLength({ max: 50 })
    .withMessage("First name exceeded maximum length")
    .escape(),
  body("last_name", "Last name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name must not be empty")
    .isLength({ max: 50 })
    .withMessage("Last name exceeded maximum length")
    .escape(),
  body("password", "Password must not be empty")
    .trim()
    .isLength({ min: 8, max: 200 })
    .withMessage("Password at least contains 8 characters")
    .isLength({ max: 200 })
    .withMessage("Password exceeded maximum length")
    .escape(),
  body("confirm_password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Confirm password must not be empty")
    .isLength({ max: 200 })
    .withMessage("Confirm password exceeded maximum length")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        try {
          const profile = new Profile({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
          });

          const user = new User({
            email: req.body.email,
            password: hashedPassword,
            profile: profile._id,
          });

          const createdUser = await user.save();
          const createdProfile = await profile.save();

          res.json({ createdUser: createdUser._id });
        } catch (err) {
          return next(err);
        }
      });
    }
  }),
];

// Handle log-in on POST
exports.log_in = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isLength({ max: 200 })
    .withMessage("Email exceeded maximum length")
    .isEmail()
    .withMessage("Email format is invalid")
    .escape(),
  body("password", "Password must not be empty")
    .trim()
    .isLength({ min: 8, max: 200 })
    .withMessage("Password must not be empty")
    .isLength({ max: 200 })
    .withMessage("Password exceeded maximum length")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
    } else {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.json({
          errors: [{ msg: "User Not Found" }],
        });
      }

      const match = await bcrypt.compare(req.body.password, user.password);

      if (!match) {
        return res.json({
          errors: [{ msg: "Incorrect Password" }],
        });
      }

      jwt.sign(
        { sub: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME },
        async (err, token) => {
          if (err) {
            return next(err);
          }
          try {
            res.json({
              token,
            });
          } catch (err) {
            return next(err);
          }
        }
      );
    }
  }),
];

// Display profile on GET
exports.profile = asyncHandler(async (req, res) => {
  const profile = await Profile.findById(req.params.profile);
  res.json({ profile });
});

// Display all profiles on GET
exports.profile_list = asyncHandler(async (req, res) => {
  const profiles = await Profile.find({ _id: { $ne: req.user.profile } }).sort({
    last_name: 1,
  });
  res.json({ profiles });
});
