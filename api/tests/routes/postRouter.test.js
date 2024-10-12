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
const Comment = require('../../models/commentModel');
const Follower = require('../../models/followerModel');

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

const mockProfileId1 = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
const profileId2 = new mongoose.Types.ObjectId('6708220913bf16f4f534c2f1');

const postId1 = new mongoose.Types.ObjectId('6708b3fba712a7ae310e91e7');
const postId2 = new mongoose.Types.ObjectId('6709a271f6c782269c51b132');

jest.mock('../../utils/passport/jwt', () => {});
jest.mock('passport', () => ({
  use: jest.fn(),
  authenticate: jest.fn(() => (req, res, next) => {
    req.user = {
      profile: {
        full_name: 'foobar',
        _id: mockProfileId1,
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
        profile: mockProfileId1,
        author: 'foobar',
        text_content: 'Text content is foobar',
        _id: postId1,
      });

      await post.save();

      const like = new Like({
        post: postId1,
        profile: mockProfileId1,
        author: 'foobar',
      });
      await like.save();

      const response = await request(app)
        .post(`/posts/${postId1}/likes`)
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ removedLike: like._id.toString() });
    });

    test('should response with created like', async () => {
      const post = new Post({
        profile: mockProfileId1,
        author: 'foobar',
        text_content: 'Text content is foobar',
        _id: postId1,
      });

      await post.save();

      const response = await request(app)
        .post(`/posts/${postId1}/likes`)
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ createdLike: expect.any(String) });
      expect(mongoose.isValidObjectId(response.body.createdLike)).toBeTruthy();
    });
  });

  describe('POST /:id/comments', () => {
    test('should response with invalid post id error', async () => {
      const response = await request(app)
        .post('/posts/123456/comments')
        .set('Content-Type', 'application/json');

      const errorObj = JSON.parse(response.error.text);

      expect(response.status).toEqual(400);
      expect(errorObj.errors[0].msg).toMatch('Invalid post ID');
    });

    test('should response with post not found error', async () => {
      const payload = { text_content: 'Text content is foobar' };

      const response = await request(app)
        .post(`/posts/${postId1}/comments`)
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(400);
      expect(JSON.parse(response.error.text)).toMatchObject({
        error: 'Post not found',
      });
    });

    test('should response with created comment id', async () => {
      const post = new Post({
        profile: mockProfileId1,
        author: 'foobar',
        text_content: 'Text content is foobar',
        _id: postId1,
      });

      await post.save();

      const payload = { text_content: 'Text content is foobar' };

      const response = await request(app)
        .post(`/posts/${postId1}/comments`)
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        createdComment: expect.any(String),
      });
      expect(
        mongoose.isValidObjectId(response.body.createdComment),
      ).toBeTruthy();
    });
  });

  describe('GET /recent', () => {
    test('should response recent posts', async () => {
      const follower1 = new Follower({
        follower: mockProfileId1,
        following: profileId2,
      });

      await follower1.save();

      const post1 = new Post({
        profile: mockProfileId1,
        author: 'foobar',
        text_content: 'Text content is foobar',
        _id: postId1,
      });
      const post2 = new Post({
        profile: profileId2,
        author: 'foobar2',
        text_content: 'Text content is foobar2',
        _id: postId2,
      });

      // Sequentially save documents to create greater time stamp intervals
      await post1.save();
      await post2.save();

      const comment1 = new Comment({
        post: postId1,
        profile: mockProfileId1,
        author: 'foobar',
        text_content: 'Comment from foobar',
      });

      await comment1.save();

      const like1 = new Like({
        post: postId1,
        profile: mockProfileId1,
        author: 'foobar',
      });

      await like1.save();

      const response = await request(app).get(`/posts/recent`);

      expect(response.body.posts[0]).toEqual(
        expect.objectContaining({
          profile: profileId2.toString(),
          author: 'foobar2',
          text_content: 'Text content is foobar2',
          likes: expect.any(Array),
          comments: expect.any(Array),
        }),
      );
      expect(response.body.posts[1]).toEqual(
        expect.objectContaining({
          profile: mockProfileId1.toString(),
          author: 'foobar',
          text_content: 'Text content is foobar',
          likes: expect.arrayContaining([expect.any(Object)]),
          comments: expect.arrayContaining([expect.any(Object)]),
        }),
      );
    });
  });
});
