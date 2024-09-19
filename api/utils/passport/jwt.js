const User = require("../../models/userModel");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.passReqToCallback = true;

module.exports = new JwtStrategy(opts, async (req, jwt_payload, done) => {
  try {
    const user = await User.findOne({ _id: jwt_payload.sub });

    if (user) {
      req.user = user;
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});
