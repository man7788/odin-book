require("dotenv").config({ path: ".env.test.local" });

const {
  connectDB,
  dropDB,
  dropCollections,
} = require("../../utils/mongoMemoryServer/setuptestdb");
const mongoose = require("mongoose");
const User = require("../../models/userModel");

const request = require("supertest");
const express = require("express");
const app = express();

const passport = require("passport");
const jwtStrategry = require("../../utils/passport/jwt");
const jwt = require("jsonwebtoken");
passport.use(jwtStrategry);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await dropDB();
});

afterEach(async () => {
  await dropCollections();
  jest.clearAllMocks();
});

const userId = new mongoose.Types.ObjectId();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send("login successful");
});

app.post("/login", (req, res) => {
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, async (err, token) => {
    if (err) {
      return next(err);
    }
    try {
      res.json({ token });
    } catch (err) {
      return next(err);
    }
  });
});

describe("jwt strategy", () => {
  test("should response with 401 Unauthorized", async () => {
    const response = await request(app).get("/");

    expect(response.status).toEqual(401);
    expect(response.text).toMatch("Unauthorized");
  });

  test("should response with login successful", async () => {
    const user = new User({
      email: "foo@bar.com",
      first_name: "foo",
      last_name: "bar",
      password: "foobar123",
      _id: userId,
    });
    await user.save();

    const login = await request(app).post("/login");

    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toEqual(200);
    expect(response.text).toMatch("login successful");
  });
});
