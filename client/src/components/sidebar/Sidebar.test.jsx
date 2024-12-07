import { render, screen } from '@testing-library/react';
import { BrowserRouter, Outlet, useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => `Redirected to ${to}`),
    Outlet: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe('Sidebar', () => {
  test('should render Sidebar', () => {
    useLocation.mockImplementation(() => {
      return { pathname: '/' };
    });

    const { container } = render(
      <BrowserRouter>
        <Sidebar
          children={<img src={'https://avatar.foobar.com/123'}></img>}
          fullName={'foobar'}
        />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
