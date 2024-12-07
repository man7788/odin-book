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

  test('should highlight Home button', async () => {
    useLocation.mockImplementation(() => {
      return { pathname: '/' };
    });

    render(
      <BrowserRouter>
        <Sidebar
          children={<img src={'https://avatar.foobar.com/123'}></img>}
          fullName={'foobar'}
        />
      </BrowserRouter>,
    );

    const homeButton = await screen.findByRole('link', {
      name: /home/i,
    });

    expect(homeButton.className).toMatch(/Active/);
  });

  test('should highlight Users button', async () => {
    useLocation.mockImplementation(() => {
      return { pathname: '/users' };
    });

    render(
      <BrowserRouter>
        <Sidebar
          children={<img src={'https://avatar.foobar.com/123'}></img>}
          fullName={'foobar'}
        />
      </BrowserRouter>,
    );

    const usersButton = await screen.findByRole('link', {
      name: /users/i,
    });

    expect(usersButton.className).toMatch(/Active/);
  });
});
