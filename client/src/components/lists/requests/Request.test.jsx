import { render, screen } from '@testing-library/react';
import Request from './Request';
import * as useProfile from '../../../hooks/useProfile';

afterEach(() => {
  vi.clearAllMocks();
});

const useProfileSpy = vi.spyOn(useProfile, 'default');

const request = {
  _id: 'request_id',
  from: 'from_id1',
  to: 'to_id1',
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
});
