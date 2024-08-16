require("dotenv").config({ path: ".env.test.local" });

const request = require("supertest");
const express = require("express");
const app = express();

const passport = require("passport");
const jwtStrategry = require("../../utils/passport/jwt");
passport.use(jwtStrategry);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send("login successful");
});

describe("jwt strategy", () => {
  test("should response with 401 Unauthorized", async () => {
    const response = await request(app).get("/");

    expect(response.status).toEqual(401);
    expect(response.text).toMatch("Unauthorized");
  });
});
