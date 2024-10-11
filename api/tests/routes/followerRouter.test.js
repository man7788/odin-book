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
const Follower = require('../../models/followerModel');

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

    test('should response with user not found error', async () => {
      const payload = {
        following_id: profileId2,
      };

      const response = await request(app)
        .post('/followers/requests')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(400);
      expect(JSON.parse(response.error.text)).toMatchObject({
        error: 'User not found',
      });
    });

    test('should response with already following error', async () => {
      const profile = new Profile({
        first_name: 'foo',
        last_name: 'bar',
        _id: profileId2,
      });
      await profile.save();

      const follower = new Follower({
        follower: profileId1,
        following: profileId2,
      });
      await follower.save();

      const payload = {
        following_id: profileId2,
      };

      const response = await request(app)
        .post('/followers/requests')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(400);
      expect(JSON.parse(response.error.text)).toMatchObject({
        error: 'Already following',
      });
    });
  });
});
