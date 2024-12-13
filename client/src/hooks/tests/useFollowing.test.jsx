import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useFollowing from '../useFollowing';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();
const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

describe('useFollowing', () => {
  test('should return loading true', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    const { result } = renderHook(() => useFollowing());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual({
        followingResult: null,
        followingLoading: true,
        followingError: null,
      });
    });
  });

  test('should throw error', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 400,
        statusText: 'Unauthorized',
      }),
    );

    const { result } = renderHook(() => useFollowing());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      followingResult: null,
      followingLoading: false,
      followingError: expect.objectContaining({
        message: 'Unauthorized',
        code: 400,
      }),
    });
  });

  test('should return response', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ response: 'foobar' }),
      }),
    );

    const { result } = renderHook(() => useFollowing());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      followingResult: { response: 'foobar' },
      followingLoading: false,
      followingError: null,
    });
  });
});
