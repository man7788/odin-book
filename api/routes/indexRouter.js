const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

// GET request for index
router.get("/", indexController.index);

// Post request for user sign-up
router.post("/signup", indexController.sign_up);

// Post request for user log-in
router.post("/login", indexController.log_in);

module.exports = router;
