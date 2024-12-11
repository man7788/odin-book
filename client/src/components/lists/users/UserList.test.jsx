import { render, screen } from '@testing-library/react';
import UserList from './UserList';
import * as useUsers from '../../../hooks/useUsers';

afterEach(() => {
  vi.clearAllMocks();
});

const useUsersSpy = vi.spyOn(useUsers, 'default');

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
});
