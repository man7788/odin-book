import { render, screen } from '@testing-library/react';
import { useOutletContext } from 'react-router-dom';
import Like from './Like';

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

describe('CommentList', () => {
  test('should render Like wiht like button', () => {
    useOutletContext.mockReturnValueOnce({
      profile: 'profile_id123',
    });

    const { container } = render(<Like postId={'placeholder'} likes={likes} />);

    expect(container).toMatchSnapshot();
  });
});
