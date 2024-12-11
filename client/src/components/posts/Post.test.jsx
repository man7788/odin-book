import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Post from './Post';
import * as useSinglePost from '../../hooks/useSinglePost';

afterEach(() => {
  vi.clearAllMocks();
});

const useSinglePostSpy = vi.spyOn(useSinglePost, 'default');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useOutletContext: () => ({
      profile: 'foobar',
    }),
  };
});

const post = {
  post: [
    {
      _id: 'post_id',
      profile: 'profile_id1',
      author: 'foo bar',
      text_content: 'Content placeholder',
      createdAt: '2024-10-18T03:17:22.075Z',
      updatedAt: '2024-10-18T03:17:22.075Z',
      __v: 0,
      likes: [
        {
          _id: 'like_id1',
          post: 'post_id',
          profile: 'profile_id2',
          author: 'foo2 bar2',
          __v: 0,
        },
        {
          _id: 'like_id2',
          post: 'post_id',
          profile: 'profile_id3',
          author: 'foo2 bar2',
          __v: 0,
        },
        {
          _id: 'like_id3',
          post: 'post_id',
          profile: 'profile_id3',
          author: 'foo bar',
          __v: 0,
        },
      ],
      comments: [
        {
          _id: 'comment_id1',
          post: 'post_id',
          profile: 'profile_id1',
          author: 'foo bar',
          text_content: 'good post',
          __v: 0,
        },
        {
          _id: 'comment_id2',
          post: 'post_id',
          profile: 'profile_id1',
          author: 'foo bar',
          text_content: 'good post',
          __v: 0,
        },
      ],
    },
  ],
};

describe('Post', () => {
  test('should render loading', () => {
    useSinglePostSpy.mockReturnValue({
      postResult: null,
      postLoading: true,
      postError: null,
    });

    const { container } = render(<Post _id={'placeholder'} />);

    expect(container).toMatchSnapshot();
  });

  test('should render error', () => {
    useSinglePostSpy.mockReturnValue({
      postResult: null,
      postLoading: false,
      postError: true,
    });

    const { container } = render(<Post _id={'placeholder'} />);

    expect(container).toMatchSnapshot();
  });

  test('should render post', () => {
    useSinglePostSpy.mockReturnValue({
      postResult: post,
      postLoading: false,
      postError: null,
      setRenderPost: vi.fn(),
    });

    const { container } = render(
      <BrowserRouter>
        <Post _id={'placeholder'} />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  test('should show link to profile', async () => {
    useSinglePostSpy.mockReturnValue({
      postResult: post,
      postLoading: false,
      postError: null,
      setRenderPost: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Post _id={'placeholder'} />
      </BrowserRouter>,
    );

    const profileLink = await screen.findByRole('link', {
      name: /foo bar/i,
    });

    expect(profileLink).toHaveAttribute('href', '/profile_id1');
  });
});
