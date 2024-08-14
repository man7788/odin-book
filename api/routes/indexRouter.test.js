const {
  connectDB,
  dropDB,
  dropCollections,
} = require("../config/tests/setuptestdb");
require("dotenv").config({ path: "./config/tests/.env.test" });

const request = require("supertest");
const express = require("express");
const indexRouter = require("./indexRouter");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", indexRouter);

const mongoose = require("mongoose");

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

describe("index route", () => {
  test("should response with 401 Unauthorized", async () => {
    const response = await request(app).get("/");

    expect(response.text).toMatch("Unauthorized");
    expect(response.status).toEqual(401);
  });
});
