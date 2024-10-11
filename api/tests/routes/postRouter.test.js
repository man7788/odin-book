const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const {
  connectDB,
  dropDB,
  dropCollections,
} = require('../../utils/mongoMemoryServer/setuptestdb');

const postRouter = require('../../routes/postRouter');

const Post = require('../../models/postModel');
const Like = require('../../models/likeModel');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/posts', postRouter);

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

const postId1 = new mongoose.Types.ObjectId('6708b3fba712a7ae310e91e7');

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

describe('posts router', () => {
  describe('POST /', () => {
    test('should response with created post id', async () => {
      const payload = {
        text_content: 'Text content is foobar',
      };

      const response = await request(app)
        .post('/posts')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ createdPost: expect.any(String) });
      expect(mongoose.isValidObjectId(response.body.createdPost)).toBeTruthy();
    });
  });

  describe('POST /:id/likes', () => {
    test('should response with invalid post id error', async () => {
      const response = await request(app)
        .post('/posts/123456/likes')
        .set('Content-Type', 'application/json');

      const errorObj = JSON.parse(response.error.text);

      expect(response.status).toEqual(400);
      expect(errorObj.errors[0].msg).toMatch('Invalid post ID');
    });

    test('should response with post not found error', async () => {
      const response = await request(app)
        .post(`/posts/${postId1}/likes`)
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(400);
      expect(JSON.parse(response.error.text)).toMatchObject({
        error: 'Post not found',
      });
    });

    test('should response with deleted like', async () => {
      const post = new Post({
        profile: profileId1,
        author: 'foobar',
        text_content: 'Text content is foobar',
        _id: postId1,
      });

      await post.save();

      const like = new Like({
        post: postId1,
        profile: profileId1,
        author: 'foobar',
      });
      await like.save();

      const response = await request(app)
        .post(`/posts/${postId1}/likes`)
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ removedLike: like._id.toString() });
    });
  });
});
