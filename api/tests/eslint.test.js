require('dotenv').config({ path: '.env.test.local' });

const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');

const {
  connectDB,
  dropDB,
  dropCollections,
} = require('../utils/mongoMemoryServer/setuptestdb');

const User = require('../models/userModel');
const Profile = require('../models/profileModel');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.get('/', (req, res) => {
  res.send('login successful');
});

test('eslint database', async () => {
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

  const users = await User.find({});
  const profiles = await Profile.find({});

  console.log('users', users);
  console.log('profiles', profiles);
  // const login = await request(app).post('/login');

  // expect(response.status).toEqual(200);
  // expect(response.text).toMatch('login successful');
});

test('Erase database ', async () => {
  const users = await User.find({});
  const profiles = await Profile.find({});

  console.log('users', users);
  console.log('profiles', profiles);
});
