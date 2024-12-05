import { render, screen } from '@testing-library/react';
import App from './App';
import * as useAuth from './hooks/useAuth';

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(({ to }) => `Redirected to ${to}`),
}));

const useAuthSpy = vi.spyOn(useAuth, 'default');

describe('App', () => {
  describe('render from useAuth result', () => {
    test('should render loading', () => {
      useAuthSpy.mockReturnValue({
        authResult: null,
        authLoading: true,
        authError: null,
      });

      const { container } = render(<App />);
      expect(container).toMatchSnapshot();
    });
  });
});
