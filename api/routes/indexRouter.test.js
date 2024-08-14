const {
  connectDB,
  dropDB,
  dropCollections,
} = require("../config/tests/setuptestdb");
require("dotenv").config({ path: "./config/tests/.env.test" });

const request = require("supertest");
const express = require("express");
const indexRouter = require("./indexRouter");
const User = require("../models/userModel");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", indexRouter);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

jest.mock("bcryptjs");

describe("index route", () => {
  test("should response with 401 Unauthorized", async () => {
    const response = await request(app).get("/");

    expect(response.status).toEqual(401);
    expect(response.text).toMatch("Unauthorized");
  });

  test("should response with login user's full name", async () => {
    bcrypt.compare.mockImplementationOnce(() => true);

    const userId = new mongoose.Types.ObjectId();

    const user = new User({
      email: "john@doe.com",
      first_name: "john",
      last_name: "doe",
      password: "johndoefoobar",
      _id: userId,
    });
    await user.save();

    const payload = { email: "john@doe.com", password: "johndoefoobar" };

    const login = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send(payload);

    const token = login.body.token;

    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.text).toMatch("john doe");
  });
});
