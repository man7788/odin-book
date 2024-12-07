import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from './Login';

afterEach(() => {
  vi.clearAllMocks();
});

describe('Login', () => {
  test('should render Login', () => {
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
