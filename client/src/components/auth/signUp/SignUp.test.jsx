import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SignUp from './SignUp';
import * as signUpFetch from '../../../fetch/signUpFetch';

afterEach(() => {
  vi.clearAllMocks();
});

const signUpFetchSpy = vi.spyOn(signUpFetch, 'default');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => `Redirected to ${to}`),
  };
});

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
  });
});
