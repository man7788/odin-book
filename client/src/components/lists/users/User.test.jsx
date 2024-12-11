import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import User from './User';
import * as useFollowing from '../../../hooks/useFollowing';
import * as requestFetch from '../../../fetch/requestFetch';

afterEach(() => {
  vi.clearAllMocks();
});

const useFollowingSpy = vi.spyOn(useFollowing, 'default');
const requestFetchSpy = vi.spyOn(requestFetch, 'default');

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

  test('should render user following button', () => {
    useFollowingSpy.mockReturnValue({
      followingResult: { following: true },
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

  test('should render user pending button', () => {
    useFollowingSpy.mockReturnValue({
      followingResult: { pending: true },
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

  describe('Submit request', () => {
    test('should render loading', async () => {
      const user = userEvent.setup();

      useFollowingSpy.mockReturnValue({
        followingResult: { following: false },
        followingLoading: false,
        followingError: null,
      });

      requestFetchSpy.mockReturnValue({
        error: null,
        result: null,
      });

      const { container } = render(
        <BrowserRouter>
          <User _id={'placeholder'} full_name={'foobar'} />,
        </BrowserRouter>,
      );

      const followButton = await screen.findByRole('button', {
        name: /follow/i,
      });

      await user.click(followButton);

      expect(container).toMatchSnapshot();
    });
  });
});
