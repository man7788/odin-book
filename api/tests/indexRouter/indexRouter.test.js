const {
  connectDB,
  dropDB,
  dropCollections,
} = require("../../utils/mongoMemoryServer/setuptestdb");
const mongoose = require("mongoose");
const User = require("../../models/userModel");

const request = require("supertest");
const express = require("express");
const indexRouter = require("../../routes/indexRouter");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", indexRouter);

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
jest.mock("../../utils/passport/jwt", () => new Object());
jest.mock("passport", () => {
  return {
    use: jest.fn(),
    authenticate: jest.fn(() => (req, res, next) => {
      req.user = { full_name: "foobar" };
      next();
    }),
  };
});

describe("index route", () => {
  test("should response with login user's full name", async () => {
    const response = await request(app).get("/");

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ full_name: expect.any(String) });
  });
});

describe("sign-up route", () => {
  test("should response with email already in use form validation error", async () => {
    const user = new User({
      email: "foo@bar.com",
      first_name: "foo",
      last_name: "bar",
      password: "foobar123",
    });
    await user.save();

    const payload = {
      email: "foo@bar.com",
      first_name: "foo",
      last_name: "bar",
      password: "foobar123",
      confirm_password: "foobar123",
    };

    const response = await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send(payload);

    expect(response.status).toEqual(200);
    expect(response.body.errors[0].msg).toMatch("Email already in use");
  });

  test("should response with passwords do not match form validation error", async () => {
    const payload = {
      email: "foo@bar.com",
      first_name: "foo",
      last_name: "bar",
      password: "foobar123",
      confirm_password: "johndoe123",
    };

    const response = await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send(payload);

    expect(response.status).toEqual(200);
    expect(response.body.errors[0].msg).toMatch("Passwords do not match");
  });
});
