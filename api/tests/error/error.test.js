const request = require("supertest");
const express = require("express");

const app = express();

app.use("/error404", (req, res, next) => {
  const error = new Error("404 error message");
  error.status = 404;
  throw error;
});

app.use("/error", (req, res, next) => {
  throw new Error("error message");
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).send(err.message);
});

describe("error handle middleware", () => {
  test("should response with status 500 error", async () => {
    const response = await request(app).get("/error");
    expect(response.status).toEqual(500);
    expect(response.error.text).toEqual("error message");
  });

  test("should response with status 404 error", async () => {
    const response = await request(app).get("/error404");
    expect(response.status).toEqual(404);
    expect(response.error.text).toEqual("404 error message");
  });
});
