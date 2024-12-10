import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GitHubCallback from './GitHubCallback';

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => `Redirected to ${to}`),
  };
});

vi.spyOn(Storage.prototype, 'setItem');

describe('GitHubCallback', () => {
  test('should render GithubCallback', () => {
    const { container } = render(
      <BrowserRouter>
        <GitHubCallback />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
