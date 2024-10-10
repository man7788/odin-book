const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const {
  connectDB,
  dropDB,
  dropCollections,
} = require('../../utils/mongoMemoryServer/setuptestdb');

const userRouter = require('../../routes/userRouter');

const Profile = require('../../models/profileModel');

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

const profileId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

jest.mock('../../utils/passport/jwt', () => {});
jest.mock('passport', () => ({
  use: jest.fn(),
  authenticate: jest.fn(() => (req, res, next) => {
    req.user = {
      profile: {
        full_name: 'foobar',
        _id: '507f1f77bcf86cd799439011',
      },
    };
    next();
  }),
}));

describe('/users route', () => {
  describe('GET /:id', () => {
    test('should response with invalid user id error', async () => {
      const response = await request(app)
        .get('/users/1234567')
        .set('Content-Type', 'application/json');

      const errorObj = JSON.parse(response.error.text);

      expect(response.status).toEqual(400);
      expect(errorObj.errors[0].msg).toMatch('Invalid user ID');
    });

    test('should response with user not found error', async () => {
      const profile = new Profile({
        first_name: 'foo',
        last_name: 'bar',
      });
      await profile.save();

      const response = await request(app)
        .get('/users/507f1f77bcf86cd799439011')
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(400);
      expect(JSON.parse(response.error.text)).toMatchObject({
        error: 'User not found',
      });
    });

    test('should response with user profile', async () => {
      const profile = new Profile({
        first_name: 'foo',
        last_name: 'bar',
        about: 'My name is foobar',
      });
      await profile.save();

      const response = await request(app)
        .get(`/users/${profile._id}`)
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body.profile).toEqual(
        expect.objectContaining({
          first_name: 'foo',
          last_name: 'bar',
          full_name: 'foo bar',
          about: 'My name is foobar',
          _id: profile._id.toString(),
        }),
      );
    });
  });

  describe('GET /', () => {
    test('should response with all user profiles except log-in user', async () => {
      const profile1 = new Profile({
        first_name: 'foo1',
        last_name: 'bar1',
        _id: profileId,
      });
      const profile2 = new Profile({
        first_name: 'foo2',
        last_name: 'bar2',
      });
      const profile3 = new Profile({
        first_name: 'foo3',
        last_name: 'bar3',
      });

      await Profile.insertMany([profile1, profile2, profile3]);

      const response = await request(app).get('/users');

      expect(response.status).toEqual(200);
      expect(response.body.profiles[0]).toEqual(
        expect.objectContaining({
          first_name: 'foo2',
          last_name: 'bar2',
          full_name: 'foo2 bar2',
          _id: profile2._id.toString(),
        }),
      );
      expect(response.body.profiles[1]).toEqual(
        expect.objectContaining({
          first_name: 'foo3',
          last_name: 'bar3',
          full_name: 'foo3 bar3',
          _id: profile3._id.toString(),
        }),
      );
    });
  });

  describe('PUT /:id', () => {
    test('should response with invalid user id error', async () => {
      const response = await request(app).put('/users/1234567');

      const errorObj = JSON.parse(response.error.text);

      expect(response.status).toEqual(400);
      expect(errorObj.errors[0].msg).toMatch('Invalid user ID');
    });
  });
});
