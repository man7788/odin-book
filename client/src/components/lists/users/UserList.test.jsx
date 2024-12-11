import { render } from '@testing-library/react';
import UserList from './UserList';
import * as useUsers from '../../../hooks/useUsers';

afterEach(() => {
  vi.clearAllMocks();
});

const useUsersSpy = vi.spyOn(useUsers, 'default');

const profiles = {
  profiles: [
    {
      _id: 'profile_id1',
    },
    {
      _id: 'profile_id2',
    },
    {
      _id: 'profile_id3',
    },
  ],
};

describe('UserList', () => {
  test('should render loading', () => {
    useUsersSpy.mockReturnValue({
      usersResult: null,
      usersLoading: true,
      usersError: null,
    });

    const { container } = render(<UserList />);

    expect(container).toMatchSnapshot();
  });

  test('should render server error', () => {
    useUsersSpy.mockReturnValue({
      usersResult: null,
      usersLoading: false,
      usersError: true,
    });

    const { container } = render(<UserList />);

    expect(container).toMatchSnapshot();
  });

  test('should render user list', () => {
    useUsersSpy.mockReturnValue({
      usersResult: profiles,
      usersLoading: false,
      usersError: null,
    });

    const { container } = render(<UserList />);

    expect(container).toMatchSnapshot();
  });

  test('should render no users', () => {
    useUsersSpy.mockReturnValue({
      usersResult: { profiles: [] },
      usersLoading: false,
      usersError: null,
    });

    const { container } = render(<UserList />);

    expect(container).toMatchSnapshot();
  });
});
