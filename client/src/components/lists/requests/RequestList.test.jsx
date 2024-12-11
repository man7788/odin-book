import { render } from '@testing-library/react';
import RequestList from './RequestList';
import * as useRequests from '../../../hooks/useRequests';

afterEach(() => {
  vi.clearAllMocks();
});

const useRequestsSpy = vi.spyOn(useRequests, 'default');

const requests = {
  requests: [
    {
      _id: '6716aebb75b77f8d82e20aca',
      from: '66f79421053c05e0e43f3d06',
      to: '66f79f7776751fc2c3a6ed96',
      __v: 0,
    },
    {
      _id: '6736a8375f8a1cc25743d42c',
      from: '67173f440dc781163183b87a',
      to: '66f79f7776751fc2c3a6ed96',
      __v: 0,
    },
  ],
};

describe('UserList', () => {
  test('should render loading', () => {
    useRequestsSpy.mockReturnValue({
      requestsResult: null,
      requestsLoading: true,
      requestsError: null,
    });

    const { container } = render(<RequestList />);

    expect(container).toMatchSnapshot();
  });

  test('should render server error', () => {
    useRequestsSpy.mockReturnValue({
      requestsResult: null,
      requestsLoading: false,
      requestsError: true,
    });

    const { container } = render(<RequestList />);

    expect(container).toMatchSnapshot();
  });

  test('should render request list', () => {
    useRequestsSpy.mockReturnValue({
      requestsResult: requests,
      requestsLoading: false,
      requestsError: null,
    });

    const { container } = render(<RequestList />);

    expect(container).toMatchSnapshot();
  });

  test('should render no requests', () => {
    useRequestsSpy.mockReturnValue({
      usersResult: { requests: [] },
      usersLoading: false,
      usersError: null,
    });

    const { container } = render(<RequestList />);

    expect(container).toMatchSnapshot();
  });
});
