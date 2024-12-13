import requestFetch from '../requestFetch';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();
const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

describe('requestFetch', () => {
  test('should throw error', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 401,
        statusText: 'Unauthorized',
      }),
    );

    const result = await requestFetch();

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

    const { result } = await requestFetch();

    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ response: 'foobar' });
  });
});
