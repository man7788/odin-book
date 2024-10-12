const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const request = require('supertest');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  '/',
  body('test_field1', 'test field error 1').custom(
    (value) => value === 'foobar',
  ),
  body('test_field2', 'test field error 2').custom(
    (value) => value === 'foobar',
  ),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    return res.status(200).end();
  }),
);

describe('validation result', () => {
  test('should response with form errors', async () => {
    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(400);
    expect.objectContaining({
      errors: expect.arrayContaining([expect.any(Object)]),
    });
  });
});
