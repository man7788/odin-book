import { render, screen } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
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
        <Sidebar fullName={'foobar'} r>
          <img src={'https://avatar.foobar.com/123'}></img>
        </Sidebar>
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  test('should highlight Home link', async () => {
    useLocation.mockImplementation(() => {
      return { pathname: '/' };
    });

    render(
      <BrowserRouter>
        <Sidebar fullName={'foobar'} r>
          <img src={'https://avatar.foobar.com/123'}></img>
        </Sidebar>
      </BrowserRouter>,
    );

    const homeLink = await screen.findByRole('link', {
      name: /home/i,
    });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink.className).toMatch(/Active/);
  });

  test('should highlight Users link', async () => {
    useLocation.mockImplementation(() => {
      return { pathname: '/users' };
    });

    render(
      <BrowserRouter>
        <Sidebar fullName={'foobar'} r>
          <img src={'https://avatar.foobar.com/123'}></img>
        </Sidebar>
      </BrowserRouter>,
    );

    const usersLink = await screen.findByRole('link', {
      name: /users/i,
    });

    expect(usersLink).toHaveAttribute('href', '/users');
    expect(usersLink.className).toMatch(/Active/);
  });

  test('should highlight Requets link', async () => {
    useLocation.mockImplementation(() => {
      return { pathname: '/requests' };
    });

    render(
      <BrowserRouter>
        <Sidebar fullName={'foobar'} r>
          <img src={'https://avatar.foobar.com/123'}></img>
        </Sidebar>
      </BrowserRouter>,
    );

    const requestsLink = await screen.findByRole('link', {
      name: /requests/i,
    });

    expect(requestsLink).toHaveAttribute('href', '/requests');
    expect(requestsLink.className).toMatch(/Active/);
  });

  test('should not highlight any link', async () => {
    useLocation.mockImplementation(() => {
      return { pathname: '/foobar' };
    });

    render(
      <BrowserRouter>
        <Sidebar fullName={'foobar'} r>
          <img src={'https://avatar.foobar.com/123'}></img>
        </Sidebar>
      </BrowserRouter>,
    );

    const allLinks = await screen.findAllByRole('link');

    allLinks.forEach((link) => {
      expect(link.className).not.toMatch(/Active/);
    });
  });
});
