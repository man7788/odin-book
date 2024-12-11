import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import User from './User';
import * as useFollowing from '../../../hooks/useFollowing';

afterEach(() => {
  vi.clearAllMocks();
});

const useFollowingSpy = vi.spyOn(useFollowing, 'default');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useOutletContext: () => ({
      profile: 'foobar',
    }),
  };
});

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

  test('should render server error', () => {
    useFollowingSpy.mockReturnValue({
      followingResult: null,
      followingLoading: false,
      followingError: true,
    });

    const { container } = render(<User _id={'placeholder'} />);

    expect(container).toMatchSnapshot();
  });

  test('should render user follow button', () => {
    useFollowingSpy.mockReturnValue({
      followingResult: { following: false },
      followingLoading: false,
      followingError: null,
    });

    const { container } = render(
      <BrowserRouter>
        <User _id={'placeholder'} full_name={'foobar'} />,
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
