import githubFetch from '../githubFetch';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();

describe('githubFetch', () => {
  test('should throw error', async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 401,
        statusText: 'Unauthorized',
      }),
    );

    const result = await githubFetch();

    expect(result.error).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
        code: 401,
      }),
    );
  });

  test('should return result', async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ response: 'foobar' }),
      }),
    );

    const { result } = await githubFetch();

    expect(result).toEqual({ response: 'foobar' });
  });
});
