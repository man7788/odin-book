require('dotenv').config({ path: '.env.test.local' });

const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const passport = require('passport');

const jwt = require('jsonwebtoken');
const jwtStrategry = require('../../utils/passport/jwt');
const {
  connectDB,
  dropDB,
  dropCollections,
} = require('../../utils/mongoMemoryServer/setuptestdb');

passport.use(jwtStrategry);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const User = require('../../models/userModel');
const Profile = require('../../models/profileModel');

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

const userId = new mongoose.Types.ObjectId();

app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('login successful');
});

// Jwt gereration for testing purposes, not testing actual impementation
app.post('/login', (req, res, next) => {
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      return next(err);
    }

    return res.json({ token });
  });
});

describe('jwt strategy', () => {
  test('should response with 401 Unauthorized', async () => {
    const response = await request(app).get('/');

    expect(response.status).toEqual(401);
    expect(response.text).toMatch('Unauthorized');
  });

  test('should pass passport jwt authentication', async () => {
    const profile = new Profile({
      first_name: 'foo',
      last_name: 'bar',
    });

    const user = new User({
      email: 'foo@bar.com',
      password: 'foobar123',
      profile: profile._id,
      _id: userId,
    });
    await user.save();
    await profile.save();

    // Get a token for authentication
    const login = await request(app).post('/login');

    const response = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(response.status).toEqual(200);
    expect(response.text).toMatch('login successful');
  });
});
