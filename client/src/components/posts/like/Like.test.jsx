import { render, screen } from '@testing-library/react';
import { useOutletContext } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Like from './Like';
import * as likeFetch from '../../../fetch/likeFetch';

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useOutletContext: vi.fn().mockReturnValue({
      profile: 'profile_id1',
    }),
  };
});

const likeFetchSpy = vi.spyOn(likeFetch, 'default');

const likes = [
  {
    _id: 'like_id1',
    post: 'post_id',
    profile: 'profile_id1',
    author: 'foo bar',
  },
  {
    _id: 'like_id2',
    post: 'post_id',
    profile: 'profile_id2',
    author: 'foo bar2',
  },
  {
    _id: 'like_id3',
    post: 'post_id',
    profile: 'profile_id3',
    author: 'foo bar3',
  },
];

describe('Like', () => {
  test('should render Like wiht like button', () => {
    useOutletContext.mockReturnValueOnce({
      profile: 'profile_id123',
    });

    const { container } = render(<Like postId={'placeholder'} likes={likes} />);

    expect(container).toMatchSnapshot();
  });

  test('should render Like wiht unlike button', () => {
    const { container } = render(<Like postId={'placeholder'} likes={likes} />);

    expect(container).toMatchSnapshot();
  });

  describe('Like button', () => {
    test('should render server error', async () => {
      const user = userEvent.setup();

      useOutletContext.mockReturnValueOnce({
        profile: 'profile_id123',
      });

      likeFetchSpy.mockReturnValueOnce({
        error: true,
      });

      const { container } = render(
        <Like postId={'placeholder'} likes={likes} />,
      );

      const like = await screen.findByRole('button', { name: /like/i });

      await user.click(like);

      expect(container).toMatchSnapshot();
    });

    test('should render like result', async () => {
      const user = userEvent.setup();

      useOutletContext.mockReturnValueOnce({
        profile: 'profile_id123',
      });

      likeFetchSpy.mockReturnValueOnce({
        result: { createdLike: true },
      });

      const { container } = render(
        <Like postId={'placeholder'} likes={likes} />,
      );

      const like = await screen.findByRole('button', { name: /like/i });

      expect(container).toMatchSnapshot();

      await user.click(like);

      expect(container).toMatchSnapshot();
    });

    test('should render unlike result', async () => {
      const user = userEvent.setup();

      useOutletContext.mockReturnValueOnce({
        profile: 'profile_id1',
      });

      likeFetchSpy.mockReturnValueOnce({
        result: { removedLike: true },
      });

      const { container } = render(
        <Like postId={'placeholder'} likes={likes} />,
      );

      const unlike = await screen.findByRole('button', { name: /unlike/i });

      expect(container).toMatchSnapshot();

      await user.click(unlike);

      expect(container).toMatchSnapshot();
    });
  });
});
