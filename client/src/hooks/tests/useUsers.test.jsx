import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useUsers from '../useUsers';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();
const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

describe('useUsers', () => {
  test('should return loading true', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual({
        usersResult: null,
        usersLoading: true,
        usersError: null,
      });
    });
  });

  test('should throw error', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 401,
        statusText: 'Unauthorized',
      }),
    );

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      usersResult: null,
      usersLoading: false,
      usersError: expect.objectContaining({
        message: 'Unauthorized',
        code: 401,
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

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      usersResult: { response: 'foobar' },
      usersLoading: false,
      usersError: null,
    });
  });
});
