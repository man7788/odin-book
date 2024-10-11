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
const Request = require('../../models/requestModel');

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
const profileId3 = new mongoose.Types.ObjectId('67088226de1902dd3ad66a84');

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

    test('should response with request pending error', async () => {
      const profile = new Profile({
        first_name: 'foo',
        last_name: 'bar',
        _id: profileId2,
      });
      await profile.save();

      const followerRequest = new Request({
        from: profileId1,
        to: profileId2,
      });
      await followerRequest.save();

      const payload = {
        following_id: profileId2,
      };

      const response = await request(app)
        .post('/followers/requests')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(400);
      expect(JSON.parse(response.error.text)).toMatchObject({
        error: 'Request pending',
      });
    });

    test('should response with created request id', async () => {
      const profile = new Profile({
        first_name: 'foo',
        last_name: 'bar',
        _id: profileId2,
      });
      await profile.save();

      const payload = {
        following_id: profileId2,
      };

      const response = await request(app)
        .post('/followers/requests')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        createdRequest: expect.any(String),
      });
      expect(
        mongoose.isValidObjectId(response.body.createdRequest),
      ).toBeTruthy();
    });
  });

  describe('GET /requests', () => {
    test('should response with all follower requests ', async () => {
      const followerRequest1 = new Request({
        from: profileId2,
        to: profileId1,
      });

      const followerRequest2 = new Request({
        from: profileId3,
        to: profileId1,
      });

      await Request.insertMany([followerRequest1, followerRequest2]);

      const response = await request(app).get('/followers/requests');

      expect(response.body.requests[0]).toEqual(
        expect.objectContaining({
          from: profileId2.toString(),
          to: profileId1.toString(),
        }),
      );
      expect(response.body.requests[1]).toEqual(
        expect.objectContaining({
          from: profileId3.toString(),
          to: profileId1.toString(),
        }),
      );
    });
  });
});
