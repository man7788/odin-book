const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  connectDB,
  dropDB,
  dropCollections,
} = require('../../utils/mongoMemoryServer/setuptestdb');

const indexRouter = require('../../routes/indexRouter');

const User = require('../../models/userModel');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', indexRouter);

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

const profileId = new mongoose.Types.ObjectId();

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../utils/passport/jwt', () => {});
jest.mock('passport', () => ({
  use: jest.fn(),
  authenticate: jest.fn(() => (req, res, next) => {
    req.user = { profile: { full_name: 'foobar' } };
    next();
  }),
}));

describe('index router', () => {
  describe('GET /', () => {
    test("should response with login user's full name", async () => {
      const response = await request(app).get('/');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ full_name: expect.any(String) });
    });
  });

  describe('POST /signup', () => {
    test('should response with email already in use form validation error', async () => {
      const user = new User({
        email: 'foo@bar.com',
        password: 'foobar123',
        profile: profileId,
      });
      await user.save();

      const payload = {
        email: 'foo@bar.com',
        first_name: 'foo',
        last_name: 'bar',
        password: 'foobar123',
        confirm_password: 'foobar123',
      };

      const response = await request(app)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].msg).toMatch('Email already in use');
    });

    test('should response with passwords do not match form validation error', async () => {
      const payload = {
        email: 'foo@bar.com',
        first_name: 'foo',
        last_name: 'bar',
        password: 'foobar123',
        confirm_password: 'johndoe123',
      };

      const response = await request(app)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].msg).toMatch('Passwords do not match');
    });

    test("should response with created user's id", async () => {
      bcrypt.hash.mockImplementationOnce((password, salt, callback) =>
        callback(null, 'hashedpassword'),
      );

      const payload = {
        email: 'foo@bar.com',
        first_name: 'foo',
        last_name: 'bar',
        password: 'foobar123',
        confirm_password: 'foobar123',
      };

      const response = await request(app)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ createdUser: expect.any(String) });
      expect(mongoose.isValidObjectId(response.body.createdUser)).toBeTruthy();
    });
  });

  describe('POST /login', () => {
    test('should response with user not found error', async () => {
      const user = new User({
        email: 'foo@bar.com',
        password: 'foobar123',
        profile: profileId,
      });
      await user.save();

      const payload = {
        email: 'john@doe.com',
        password: 'johndoe123',
      };

      const response = await request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].msg).toMatch('User Not Found');
    });

    test('should response with incorrect password error', async () => {
      bcrypt.compare.mockImplementationOnce(() => false);

      const user = new User({
        email: 'foo@bar.com',
        password: 'foobar123',
        profile: profileId,
      });
      await user.save();

      const payload = {
        email: 'foo@bar.com',
        password: 'johndoe123',
      };

      const response = await request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].msg).toMatch('Incorrect Password');
    });

    test('should response json web token', async () => {
      bcrypt.compare.mockImplementationOnce(() => true);
      jwt.sign.mockImplementationOnce(
        (token, secretOrPublicKey, options, callback) =>
          callback(null, '123abc$'),
      );

      const user = new User({
        email: 'foo@bar.com',
        password: 'foobar123',
        profile: profileId,
      });
      await user.save();

      const payload = {
        email: 'foo@bar.com',
        password: 'johndoe123',
      };

      const response = await request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ token: '123abc$' });
    });
  });
});
