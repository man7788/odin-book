import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Request from './Request';
import * as useProfile from '../../../hooks/useProfile';
import * as acceptFetch from '../../../fetch/acceptFetch';

afterEach(() => {
  vi.clearAllMocks();
});

const useProfileSpy = vi.spyOn(useProfile, 'default');
const acceptFetchSpy = vi.spyOn(acceptFetch, 'default');

const request = {
  _id: 'request_id',
  from: 'profile_id2',
  to: 'profile_id1',
};

const profile = {
  profile: {
    full_name: 'foo bar2',
    about: 'My name is Foobar2',
    _id: 'profile_id2',
  },
};

describe('User', () => {
  test('should render loading', () => {
    useProfileSpy.mockReturnValue({
      profileResult: null,
      profileLoading: true,
      profileError: null,
    });

    const { container } = render(<Request request={request} />);

    expect(container).toMatchSnapshot();
  });

  test('should render server error', () => {
    useProfileSpy.mockReturnValue({
      profileResult: null,
      profileLoading: false,
      profileError: true,
    });

    const { container } = render(<Request request={request} />);

    expect(container).toMatchSnapshot();
  });

  test('should render accept button', () => {
    useProfileSpy.mockReturnValue({
      profileResult: profile,
      profileLoading: false,
      profileError: null,
    });

    const { container } = render(
      <BrowserRouter>
        <Request request={request} />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  describe('Accept button', () => {
    test('should render server error', async () => {
      const user = userEvent.setup();

      useProfileSpy.mockReturnValue({
        profileResult: profile,
        profileLoading: false,
        profileError: null,
      });

      acceptFetchSpy.mockReturnValue({
        error: true,
      });

      const { container } = render(
        <BrowserRouter>
          <Request request={request} />
        </BrowserRouter>,
      );

      const acceptButton = await screen.findByRole('button', {
        name: /accept/i,
      });

      await user.click(acceptButton);

      expect(container).toMatchSnapshot();
    });

    test('should render submit result', async () => {
      const setRefresh = vi.fn();
      const user = userEvent.setup();

      useProfileSpy.mockReturnValue({
        profileResult: profile,
        profileLoading: false,
        profileError: null,
      });

      acceptFetchSpy.mockReturnValue({
        result: true,
      });

      render(
        <BrowserRouter>
          <Request request={request} setRefresh={setRefresh} />
        </BrowserRouter>,
      );

      const acceptButton = await screen.findByRole('button', {
        name: /accept/i,
      });

      await user.click(acceptButton);

      expect(setRefresh).toHaveBeenCalled();
    });
  });
});
