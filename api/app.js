require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");
const followerRouter = require("./routes/followerRouter");
const postRouter = require("./routes/postRouter");

var app = express();
app.use(cors());

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/followers", followerRouter);
app.use("/posts", postRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Only providing error in development
  const errMessage = req.app.get("env") === "development" ? err.message : "";
  res.status(err.status || 500).send(errMessage);
});

module.exports = app;
