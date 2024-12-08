import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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
});
