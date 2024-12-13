import commentFetch from '../commentFetch';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();
const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

describe('acceptFetch', () => {
  test('should throw bad request error', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

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

    const result = await commentFetch();

    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(result.error).toEqual({
      errors: [{ msg: 'error message' }],
    });
  });

  test('should throw unauthorized error', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 401,
        statusText: 'Unauthorized',
      }),
    );

    const result = await commentFetch();

    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(result.error).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
        code: 401,
      }),
    );
  });

  test('should return result', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ response: 'foobar' }),
      }),
    );

    const { result } = await commentFetch();

    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ response: 'foobar' });
  });
});
