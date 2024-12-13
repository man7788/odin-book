import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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

  test('should render App error', () => {
    useAuthSpy.mockReturnValue({
      authResult: true,
      authLoading: false,
      authError: null,
    });

    const { container } = render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  test('should render error page', () => {
    useAuthSpy.mockReturnValue({
      authResult: null,
      authLoading: false,
      authError: true,
    });

    const { container } = render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
