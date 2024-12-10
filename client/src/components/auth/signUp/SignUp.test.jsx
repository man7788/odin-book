import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SignUp from './SignUp';
import * as signUpFetch from '../../../fetch/signUpFetch';
import * as loginFetch from '../../../fetch/loginFetch';

afterEach(() => {
  vi.clearAllMocks();
});

const signUpFetchSpy = vi.spyOn(signUpFetch, 'default');
const loginFetchSpy = vi.spyOn(loginFetch, 'default');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => `Redirected to ${to}`),
  };
});

vi.spyOn(Storage.prototype, 'setItem');

describe('SignUp', () => {
  describe('SignUp form', () => {
    test('should show user input', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>,
      );

      const submitButton = await screen.findByRole('button', {
        name: /sign up/i,
      });

      expect(submitButton.className).toMatch(/disable/i);

      const firstNamelInput = await screen.findByPlaceholderText('First name');
      const lastNameInput = await screen.findByPlaceholderText('Last name');
      const emailInput = await screen.findByPlaceholderText('Email address');
      const newPasswordInput = await screen.findByPlaceholderText(
        'New password',
      );
      const confirimPasswordInput = await screen.findByPlaceholderText(
        'Confirm password',
      );

      await user.type(firstNamelInput, 'foo');
      await user.type(lastNameInput, 'bar');
      await user.type(emailInput, 'foo@bar.com');
      await user.type(newPasswordInput, 'foobar');
      await user.type(confirimPasswordInput, 'foobar');

      expect(submitButton.className).not.toMatch(/disable/i);

      expect(firstNamelInput).toHaveValue('foo');
      expect(lastNameInput).toHaveValue('bar');
      expect(emailInput).toHaveValue('foo@bar.com');
      expect(newPasswordInput).toHaveValue('foobar');
      expect(confirimPasswordInput).toHaveValue('foobar');
    });

    test('should show form submit loading', async () => {
      const user = userEvent.setup();

      signUpFetchSpy.mockReturnValueOnce({
        resut: null,
        error: null,
      });

      const { container } = render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>,
      );

      const submitButton = await screen.findByRole('button', {
        name: /sign up/i,
      });

      expect(submitButton.className).toMatch(/disable/i);

      const firstNamelInput = await screen.findByPlaceholderText('First name');
      const lastNameInput = await screen.findByPlaceholderText('Last name');
      const emailInput = await screen.findByPlaceholderText('Email address');
      const newPasswordInput = await screen.findByPlaceholderText(
        'New password',
      );
      const confirimPasswordInput = await screen.findByPlaceholderText(
        'Confirm password',
      );

      await user.type(firstNamelInput, 'foo');
      await user.type(lastNameInput, 'bar');
      await user.type(emailInput, 'foo@bar.com');
      await user.type(newPasswordInput, 'foobar');
      await user.type(confirimPasswordInput, 'foobar');

      await user.click(submitButton);

      expect(container).toMatchSnapshot();
    });

    test('should show form errors', async () => {
      const user = userEvent.setup();

      signUpFetchSpy.mockReturnValueOnce({
        error: {
          errors: [
            { msg: 'first name error' },
            { msg: 'last name error' },
            { msg: 'email error' },
            { msg: 'password not match error' },
            { msg: 'confirm password error' },
            { msg: 'password error' },
          ],
        },
      });

      render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>,
      );

      const submitButton = await screen.findByRole('button', {
        name: /sign up/i,
      });

      expect(submitButton.className).toMatch(/disable/i);

      const firstNamelInput = await screen.findByPlaceholderText('First name');
      const lastNameInput = await screen.findByPlaceholderText('Last name');
      const emailInput = await screen.findByPlaceholderText('Email address');
      const newPasswordInput = await screen.findByPlaceholderText(
        'New password',
      );
      const confirimPasswordInput = await screen.findByPlaceholderText(
        'Confirm password',
      );

      await user.type(firstNamelInput, 'foo');
      await user.type(lastNameInput, 'bar');
      await user.type(emailInput, 'foo@bar.com');
      await user.type(newPasswordInput, 'foobar');
      await user.type(confirimPasswordInput, 'foobar');

      await user.click(submitButton);

      const firstNameError = await screen.findByText('first name error');
      const lastNameError = await screen.findByText('last name error');
      const emailError = await screen.findByText('email error');
      const passwordError = await screen.findByText('password error');
      const confirmPasswordError = await screen.findByText(
        'confirm password error',
      );

      expect(firstNameError).toBeInTheDocument();
      expect(lastNameError).toBeInTheDocument();
      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
      expect(confirmPasswordError).toBeInTheDocument();

      await user.type(firstNamelInput, '{backspace}');
      await user.type(lastNameInput, '{backspace}');
      await user.type(emailInput, '{backspace}');
      await user.type(newPasswordInput, '123');
      await user.type(confirimPasswordInput, '123');

      expect(firstNameError).not.toHaveValue('email error');
      expect(lastNameError).not.toHaveValue('last name error');
      expect(emailError).not.toHaveValue('email error');
      expect(passwordError).not.toHaveValue('password error');
      expect(confirmPasswordError).not.toHaveValue('confirm password error');
    });

    test('should show server error', async () => {
      const user = userEvent.setup();

      signUpFetchSpy.mockReturnValue({
        error: true,
      });

      const { container } = render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>,
      );

      const firstNamelInput = await screen.findByPlaceholderText('First name');
      const lastNameInput = await screen.findByPlaceholderText('Last name');
      const emailInput = await screen.findByPlaceholderText('Email address');
      const newPasswordInput = await screen.findByPlaceholderText(
        'New password',
      );
      const confirimPasswordInput = await screen.findByPlaceholderText(
        'Confirm password',
      );
      const submitButton = await screen.findByRole('button', {
        name: /sign up/i,
      });

      await user.type(firstNamelInput, 'foo');
      await user.type(lastNameInput, 'bar');
      await user.type(emailInput, 'foo@bar.com');
      await user.type(newPasswordInput, 'foobar');
      await user.type(confirimPasswordInput, 'foobar');

      await user.click(submitButton);

      expect(container).toMatchSnapshot();
    });

    describe('Auto login', () => {
      test('should show server error', async () => {
        const user = userEvent.setup();

        signUpFetchSpy.mockReturnValue({
          result: true,
        });

        loginFetchSpy.mockReturnValue({
          error: true,
        });

        const { container } = render(
          <BrowserRouter>
            <SignUp />
          </BrowserRouter>,
        );

        const firstNamelInput = await screen.findByPlaceholderText(
          'First name',
        );
        const lastNameInput = await screen.findByPlaceholderText('Last name');
        const emailInput = await screen.findByPlaceholderText('Email address');
        const newPasswordInput = await screen.findByPlaceholderText(
          'New password',
        );
        const confirimPasswordInput = await screen.findByPlaceholderText(
          'Confirm password',
        );
        const submitButton = await screen.findByRole('button', {
          name: /sign up/i,
        });

        await user.type(firstNamelInput, 'foo');
        await user.type(lastNameInput, 'bar');
        await user.type(emailInput, 'foo@bar.com');
        await user.type(newPasswordInput, 'foobar');
        await user.type(confirimPasswordInput, 'foobar');

        await user.click(submitButton);

        expect(container).toMatchSnapshot();
      });

      test('should redirect to homepage', async () => {
        const user = userEvent.setup();

        signUpFetchSpy.mockReturnValue({
          result: true,
        });

        loginFetchSpy.mockReturnValue({
          result: { token: 'jwt' },
        });

        const { container } = render(
          <BrowserRouter>
            <SignUp />
          </BrowserRouter>,
        );

        const firstNamelInput = await screen.findByPlaceholderText(
          'First name',
        );
        const lastNameInput = await screen.findByPlaceholderText('Last name');
        const emailInput = await screen.findByPlaceholderText('Email address');
        const newPasswordInput = await screen.findByPlaceholderText(
          'New password',
        );
        const confirimPasswordInput = await screen.findByPlaceholderText(
          'Confirm password',
        );
        const submitButton = await screen.findByRole('button', {
          name: /sign up/i,
        });

        await user.type(firstNamelInput, 'foo');
        await user.type(lastNameInput, 'bar');
        await user.type(emailInput, 'foo@bar.com');
        await user.type(newPasswordInput, 'foobar');
        await user.type(confirimPasswordInput, 'foobar');

        await user.click(submitButton);

        expect(localStorage.setItem).toHaveBeenCalledWith(
          'token',
          JSON.stringify('jwt'),
        );
        expect(container).toMatchSnapshot();
      });
    });
  });
});
