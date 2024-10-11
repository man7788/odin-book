const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const {
  connectDB,
  dropDB,
  dropCollections,
} = require('../../utils/mongoMemoryServer/setuptestdb');

const followerRouter = require('../../routes/followerRouter');

const Profile = require('../../models/profileModel');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/followers', followerRouter);

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

const profileId1 = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
const profileId2 = new mongoose.Types.ObjectId('6708220913bf16f4f534c2f1');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../utils/passport/jwt', () => {});
jest.mock('passport', () => ({
  use: jest.fn(),
  authenticate: jest.fn(() => (req, res, next) => {
    req.user = {
      profile: { full_name: 'foobar', _id: '507f1f77bcf86cd799439011' },
    };
    next();
  }),
}));

describe('follower router', () => {
  describe('POST /requests', () => {
    test('should response with invalid user id error', async () => {
      const payload = {
        following_id: '123456',
      };

      const response = await request(app)
        .post('/followers/requests')
        .set('Content-Type', 'application/json')
        .send(payload);

      const errorObj = JSON.parse(response.error.text);

      expect(response.status).toEqual(400);
      expect(errorObj.errors[0].msg).toMatch('Invalid following user id');
    });
  });
});
