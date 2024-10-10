const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const request = require('supertest');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  '/',
  body('test_field', 'test field error 1').custom(() => false),
  body('test_field', 'test field error 2').custom(() => false),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    return null;
  }),
);

test('should response with form errors', async () => {
  const response = await request(app)
    .post('/')
    .set('Content-Type', 'application/json');

  expect(response.status).toEqual(400);
  expect(response.body.errors[0].msg).toMatch('test field error 1');
  expect(response.body.errors[1].msg).toMatch('test field error 2');
});
