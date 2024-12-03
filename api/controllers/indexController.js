const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const Profile = require('../models/profileModel');

// Display index on GET
exports.index = asyncHandler(async (req, res) => {
  res.json({
    full_name: req.user.profile.full_name,
    profile: req.user.profile._id,
    avatar: req.user.profile.avatar,
  });
});

// Handle sign-up on POST
exports.sign_up = [
  body('email')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email must not be empty')
    .isLength({ max: 320 })
    .withMessage('Email exceeded maximum length')
    .isEmail()
    .withMessage('Email format is invalid')
    .bail()
    .escape()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already in use');
      }
    }),
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name must not be empty')
    .isLength({ max: 25 })
    .withMessage('First name exceeded maximum length')
    .escape(),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name must not be empty')
    .isLength({ max: 25 })
    .withMessage('Last name exceeded maximum length')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password at least contains 8 characters')
    .isLength({ max: 200 })
    .withMessage('Password exceeded maximum length')
    .escape(),
  body('confirm_password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Confirm password must not be empty')
    .isLength({ max: 200 })
    .withMessage('Confirm password exceeded maximum length')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      try {
        const profile = new Profile({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          avatar: req.body.email,
        });

        const user = new User({
          email: req.body.email,
          password: hashedPassword,
          profile: profile._id,
        });

        const createdUser = await user.save();
        await profile.save();

        res.json({ createdUser: createdUser._id });
      } catch {
        return next(err);
      }
      return null;
    });
    return null;
  }),
];

// Handle log-in on POST
exports.log_in = [
  body('email')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email must not be empty')
    .bail()
    .isEmail()
    .withMessage('Email format is invalid')
    .isLength({ max: 255 })
    .withMessage('Email exceeded maximum length')
    .escape(),
  body('password', 'Password must not be empty')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password must not be empty')
    .isLength({ max: 200 })
    .withMessage('Password exceeded maximum length')
    .escape(),

  // eslint-disable-next-line consistent-return
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const user = await User.findOne({ email: req.body.email }, 'password');

    if (!user) {
      // Response the same format as express-validator response
      return res.status(400).json({
        errors: [{ msg: 'User Not Found' }],
      });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      // Response the same format as express-validator response
      return res.status(400).json({
        errors: [{ msg: 'Incorrect Password' }],
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

        return res.json({
          token,
        });
      },
    );
  }),
];

// Handle Github log-in callback on POST
exports.github_login = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  // Exchange code for access token
  const tokenResponse = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    },
  );

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (accessToken) {
    // Use this access token to fetch user details or other tasks.
    // Maybe generate a JWT and send it to the frontend for session management.
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const emails = await emailResponse.json();

    let primaryEmail;

    // Prevent React strict mode throwing error when receiving error response
    if (Array.isArray(emails)) {
      const userEmail = emails.filter((email) => {
        let targetEmail;
        if (email.primary === true) {
          targetEmail = email.email;
        }
        return targetEmail;
      });
      primaryEmail = userEmail[0].email;

      let user = await User.findOne({ email: primaryEmail });

      if (!user) {
        const userResponse = await fetch('https://api.github.com/user', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userData = await userResponse.json();

        const newProfile = new Profile({
          first_name: userData.login,
          avatar: userData.avatar_url,
        });

        const newUser = new User({
          email: primaryEmail,
          password: null,
          profile: newProfile._id,
        });

        await newUser.save();
        await newProfile.save();

        user = newUser;
      }

      jwt.sign(
        { sub: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME },
        async (err, token) => {
          if (err) {
            return next(err);
          }

          return res.json({
            token,
          });
        },
      );
    }
  } else {
    res.status(401).json(tokenData);
  }
});
