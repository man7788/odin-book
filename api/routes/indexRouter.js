const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

const passport = require("passport");
const jwtStrategry = require("../config/passport/strategies/jwt");
passport.use(jwtStrategry);

// GET request for index
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user.full_name);
  }
);

// Post request for user sign-up
router.post("/signup", indexController.sign_up);

// Post request for user log-in
router.post("/login", indexController.log_in);

module.exports = router;
