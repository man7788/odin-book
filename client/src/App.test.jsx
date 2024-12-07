import { render, screen } from '@testing-library/react';
import { BrowserRouter, Outlet } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as useAuth from './hooks/useAuth';

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => `Redirected to ${to}`),
    Outlet: vi.fn(),
  };
});

const useAuthSpy = vi.spyOn(useAuth, 'default');

describe('App', () => {
  describe('render from useAuth result', () => {
    test('should render loading', () => {
      useAuthSpy.mockReturnValue({
        authResult: null,
        authLoading: true,
        authError: null,
      });

      const { container } = render(<App />);
      expect(container).toMatchSnapshot();
    });

    test('should redirect to login', () => {
      useAuthSpy.mockReturnValue({
        authResult: null,
        authLoading: false,
        authError: { code: 401 },
      });

      const { container } = render(<App />);
      expect(container).toMatchSnapshot();
    });

    test('should render server error', async () => {
      useAuthSpy.mockReturnValue({
        authResult: null,
        authLoading: false,
        authError: true,
      });

      const { container } = render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('render from error redirect', () => {
    test('should render content error', async () => {
      useAuthSpy.mockReturnValue({
        authResult: true,
        authLoading: false,
        authError: null,
      });

      const { container } = render(
        <BrowserRouter>
          <App errorRedirect={true} />
        </BrowserRouter>,
      );

      expect(container).toMatchSnapshot();
    });
  });

  test('should render content', async () => {
    useAuthSpy.mockReturnValue({
      authResult: true,
      authLoading: false,
      authError: null,
    });

    Outlet.mockImplementationOnce(() => <div>Content Placeholder</div>);

    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  describe('Create pop-up', () => {
    test('should render Create pop-up', async () => {
      const user = userEvent.setup();

      useAuthSpy.mockReturnValue({
        authResult: true,
        authLoading: false,
        authError: null,
      });

      Outlet.mockImplementation(() => <div>Content Placeholder</div>);

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );

      const createButton = await screen.findByRole('button', {
        name: /create/i,
      });

      await user.click(createButton);

      const createPopup = await screen.findByTestId('createPopup');

      expect(createPopup).toBeInTheDocument();
    });

    test('should close Create pop-up when click on blank space', async () => {
      const user = userEvent.setup();

      useAuthSpy.mockReturnValue({
        authResult: true,
        authLoading: false,
        authError: null,
      });

      Outlet.mockImplementation(() => <div>Content Placeholder</div>);

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );

      const createButton = await screen.findByRole('button', {
        name: /create/i,
      });

      await user.click(createButton);

      const createPopup = await screen.findByTestId('createPopup');

      expect(createPopup).toBeInTheDocument();

      const blank = await screen.findByTestId('blank');

      await user.click(blank);

      expect(createPopup).not.toBeInTheDocument();
    });

    test('should close Create pop-up when click on cancel button', async () => {
      const user = userEvent.setup();

      useAuthSpy.mockReturnValue({
        authResult: true,
        authLoading: false,
        authError: null,
      });

      Outlet.mockImplementation(() => <div>Content Placeholder</div>);

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );

      const createButton = await screen.findByRole('button', {
        name: /create/i,
      });

      await user.click(createButton);

      const createPopup = await screen.findByTestId('createPopup');

      expect(createPopup).toBeInTheDocument();

      const cancelButton = await screen.findByRole('button', {
        name: /cancel/i,
      });

      await user.click(cancelButton);

      expect(createPopup).not.toBeInTheDocument();
    });
  });
});
