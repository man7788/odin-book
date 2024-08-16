const {
  connectDB,
  dropDB,
  dropCollections,
} = require("../utils/mongoMemoryServer/setuptestdb");

const request = require("supertest");
const express = require("express");
const indexRouter = require("./indexRouter");
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
jest.mock("../utils/passport/jwt", () => new Object());
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
