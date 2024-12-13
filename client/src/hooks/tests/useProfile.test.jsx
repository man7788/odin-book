import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useProfile from '../useProfile';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();
const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

describe('useProfile', () => {
  test('should return loading true', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual({
        profileResult: null,
        profileLoading: true,
        profileError: null,
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

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      profileResult: null,
      profileLoading: false,
      profileError: expect.objectContaining({
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

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      profileResult: { response: 'foobar' },
      profileLoading: false,
      profileError: null,
    });
  });
});
