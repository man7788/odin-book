const request = require('supertest');
const express = require('express');
const createError = require('http-errors');

const app = express();

app.use('/error', () => {
  throw new Error('error message');
});

app.use((req, res, next) => {
  next(createError(404));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

describe('error handle middleware', () => {
  test('should response with status 404 error', async () => {
    // GET request for non-existence uri
    const response = await request(app)
      .get('/foobar')
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(404);
    expect(JSON.parse(response.error.text)).toMatchObject({
      error: 'Not Found',
    });
  });

  test('should response with status 500 error', async () => {
    const response = await request(app).get('/error');

    expect(response.status).toEqual(500);
    expect(JSON.parse(response.error.text)).toMatchObject({
      error: 'error message',
    });
  });
});
