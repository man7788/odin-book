import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as useAuth from './hooks/useAuth';

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => `Redirected to ${to}`),
  };
});

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

    test('should redirect to login', () => {
      useAuthSpy.mockReturnValue({
        authResult: null,
        authLoading: false,
        authError: { code: 401 },
      });

      const { container } = render(<App />);
      expect(container).toMatchSnapshot();
    });

    test('should render server error', async () => {
      useAuthSpy.mockReturnValue({
        authResult: null,
        authLoading: false,
        authError: true,
      });

      const { container } = render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
