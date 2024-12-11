import { render, screen } from '@testing-library/react';
import User from './User';
import * as useFollowing from '../../../hooks/useFollowing';

afterEach(() => {
  vi.clearAllMocks();
});

const useFollowingSpy = vi.spyOn(useFollowing, 'default');

describe('User', () => {
  test('should render loading', () => {
    useFollowingSpy.mockReturnValue({
      followingResult: null,
      followingLoading: true,
      followingError: null,
    });

    const { container } = render(<User _id={'placeholder'} />);

    expect(container).toMatchSnapshot();
  });
});
