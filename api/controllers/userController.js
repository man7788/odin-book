const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Handle sign-up on POST
exports.sign_up = [
  body("email")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Email must not be empty")
    .bail()
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
  body("first_name", "Full name must not be empty")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("last_name", "Last name must not be empty")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("password", "Password must not be empty")
    .trim()
    .isLength({ min: 8, max: 200 })
    .withMessage("Password at least contains 8 characters")
    .escape(),
  body("confirm_password")
    .trim()
    .isLength({ min: 8, max: 200 })
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
          const user = new User({
            email: req.body.email,
            password: hashedPassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
          });

          const createdUser = await user.save();

          res.json({ createdUser });
        } catch (err) {
          return next(err);
        }
      });
    }
  }),
];
