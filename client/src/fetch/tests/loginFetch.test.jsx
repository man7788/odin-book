import loginFetch from '../loginFetch';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();

describe('loginFetch', () => {
  test('should throw bad request error', async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        statusText: 'Bad Request',
        json: () =>
          Promise.resolve({
            errors: [{ msg: 'error message' }],
          }),
      }),
    );

    const result = await loginFetch();

    expect(result.error).toEqual({
      errors: [{ msg: 'error message' }],
    });
  });

  test('should throw unauthorized error', async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 401,
        statusText: 'Unauthorized',
      }),
    );

    const result = await loginFetch();

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

    const { result } = await loginFetch();

    expect(result).toEqual({ response: 'foobar' });
  });
});
