const request = require('supertest');
const express = require('express');
const {
  connectDB,
  dropDB,
  dropCollections,
} = require('../../utils/mongoMemoryServer/setuptestdb');

const userRouter = require('../../routes/userRouter');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/users', userRouter);

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

jest.mock('../../utils/passport/jwt', () => {});
jest.mock('passport', () => ({
  use: jest.fn(),
  authenticate: jest.fn(() => (req, res, next) => {
    req.user = { profile: { full_name: 'foobar' } };
    next();
  }),
}));

describe('users route', () => {
  describe('GET /:id', () => {
    test('should response with invalid user id error', async () => {
      const response = await request(app)
        .get('/users/1234567')
        .set('Content-Type', 'application/json');

      const errorObj = JSON.parse(response.error.text);

      expect(response.status).toEqual(400);
      expect(errorObj.errors[0].msg).toMatch('Invalid user ID');
    });
  });
});
