import { render, screen } from '@testing-library/react';
import ErrorPage from './ErrorPage';
import * as useAuth from './hooks/useAuth';

afterEach(() => {
  vi.clearAllMocks();
});

const useAuthSpy = vi.spyOn(useAuth, 'default');

describe('ErrorPage', () => {
  test('should render loading', () => {
    useAuthSpy.mockReturnValue({
      authResult: null,
      authLoading: true,
      authError: null,
    });

    const { container } = render(<ErrorPage />);

    expect(container).toMatchSnapshot();
  });
});
