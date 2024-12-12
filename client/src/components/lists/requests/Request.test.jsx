import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Request from './Request';
import * as useProfile from '../../../hooks/useProfile';

afterEach(() => {
  vi.clearAllMocks();
});

const useProfileSpy = vi.spyOn(useProfile, 'default');

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
});
