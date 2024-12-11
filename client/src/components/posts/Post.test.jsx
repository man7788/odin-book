import { render, screen } from '@testing-library/react';
import Post from './Post';
import * as useSinglePost from '../../hooks/useSinglePost';

afterEach(() => {
  vi.clearAllMocks();
});

const useSinglePostSpy = vi.spyOn(useSinglePost, 'default');

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
});
