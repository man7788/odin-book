import { render, screen } from '@testing-library/react';
import PostList from './PostList';
import * as usePosts from '../../hooks/usePosts';

afterEach(() => {
  vi.clearAllMocks();
});

const usePostsSpy = vi.spyOn(usePosts, 'default');

describe('PostList', () => {
  test('should render loading', () => {
    usePostsSpy.mockReturnValue({
      postsResult: null,
      postsLoading: true,
      postsError: null,
    });

    const { container } = render(<PostList />);

    expect(container).toMatchSnapshot();
  });

  test('should render error', async () => {
    usePostsSpy.mockReturnValue({
      postsResult: null,
      postsLoading: false,
      postsError: true,
    });

    const { container } = render(<PostList />);

    expect(container).toMatchSnapshot();
  });
});
