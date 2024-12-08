import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import * as useAuth from '../../../hooks/useAuth';

afterEach(() => {
  vi.clearAllMocks();
});

const useAuthSpy = vi.spyOn(useAuth, 'default');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => `Redirected to ${to}`),
  };
});

describe('Login', () => {
  test('should render loading', () => {
    useAuthSpy.mockReturnValue({
      authResult: null,
      authLoading: true,
      authError: null,
    });

    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  test('should render Login', () => {
    useAuthSpy.mockReturnValue({
      authResult: null,
      authLoading: false,
      authError: true,
    });

    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  test('should redirect to homepage', () => {
    useAuthSpy.mockReturnValue({
      authResult: true,
      authLoading: false,
      authError: false,
    });

    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  describe('Login form', () => {
    test('should show user input', async () => {
      const user = userEvent.setup();

      useAuthSpy.mockReturnValue({
        authResult: null,
        authLoading: false,
        authError: true,
      });

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>,
      );

      const emailInput = await screen.findByPlaceholderText('Email address');
      const passwordInput = await screen.findByPlaceholderText('Password');

      await user.type(emailInput, 'foo@bar.com');
      await user.type(passwordInput, 'foobar');

      expect(emailInput).toHaveValue('foo@bar.com');
      expect(passwordInput).toHaveValue('foobar');
    });
  });
});
