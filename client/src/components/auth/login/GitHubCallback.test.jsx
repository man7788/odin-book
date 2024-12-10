import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { waitFor } from '@testing-library/react';
import GitHubCallback from './GitHubCallback';
import * as githubFetch from '../../../fetch/githubFetch';

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

const githubFetchSpy = vi.spyOn(githubFetch, 'default');
vi.spyOn(Storage.prototype, 'setItem');

describe('GitHubCallback', () => {
  test('should render GithubCallback', () => {
    const { container } = render(<GitHubCallback />);

    expect(container).toMatchSnapshot();
  });

  test('should redirect to homepage', async () => {
    githubFetchSpy.mockReturnValue({
      result: { token: 'jwt' },
    });

    const { container } = render(<GitHubCallback />);

    await waitFor(() => expect(githubFetchSpy).toHaveBeenCalledTimes(1));

    await act(async () => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'token',
        JSON.stringify('jwt'),
      );
      expect(container).toMatchSnapshot();
    });
  });
});
