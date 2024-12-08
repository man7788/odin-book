import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import * as useAuth from '../../../hooks/useAuth';
import * as loginFetch from '../../../fetch/loginFetch';

afterEach(() => {
  vi.clearAllMocks();
});

const useAuthSpy = vi.spyOn(useAuth, 'default');
const loginFetchSpy = vi.spyOn(loginFetch, 'default');

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

      const submitButton = await screen.findByRole('button', {
        name: /log in/i,
      });

      expect(submitButton.className).toMatch(/disable/i);

      const emailInput = await screen.findByPlaceholderText('Email address');
      const passwordInput = await screen.findByPlaceholderText('Password');

      await user.type(emailInput, 'foo@bar.com');
      await user.type(passwordInput, 'foobar');

      expect(submitButton.className).not.toMatch(/disable/i);

      expect(emailInput).toHaveValue('foo@bar.com');
      expect(passwordInput).toHaveValue('foobar');
    });

    test('should show user input errors', async () => {
      const user = userEvent.setup();

      useAuthSpy.mockReturnValue({
        authResult: null,
        authLoading: false,
        authError: true,
      });

      loginFetchSpy.mockReturnValue({
        error: {
          errors: [{ msg: 'email error' }, { msg: 'password error' }],
        },
      });

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>,
      );

      const emailInput = await screen.findByPlaceholderText('Email address');
      const passwordInput = await screen.findByPlaceholderText('Password');
      const submitButton = await screen.findByRole('button', {
        name: /log in/i,
      });

      await user.type(emailInput, 'foo@bar.com');
      await user.type(passwordInput, 'foobar');
      await user.click(submitButton);

      const emailError = await screen.findByText('email error');
      const passwordError = await screen.findByText('password error');

      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();

      await user.type(emailInput, '{backspace}');
      await user.type(passwordInput, '123');

      expect(emailError).not.toHaveValue('email error');
      expect(passwordError).not.toHaveValue('password error');
    });
  });
});
