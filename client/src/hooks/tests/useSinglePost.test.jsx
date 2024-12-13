import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useSinglePost from '../useSinglePost';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();
const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

describe('useSinglePost', () => {
  test('should return loading true', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    const { result } = renderHook(() => useSinglePost());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual({
        postResult: null,
        postLoading: true,
        postError: null,
        setRenderPost: expect.any(Function),
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

    const { result } = renderHook(() => useSinglePost());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      postResult: null,
      postLoading: false,
      postError: expect.objectContaining({
        message: 'Unauthorized',
        code: 401,
      }),
      setRenderPost: expect.any(Function),
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

    const { result } = renderHook(() => useSinglePost());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      postResult: { response: 'foobar' },
      postLoading: false,
      postError: null,
      setRenderPost: expect.any(Function),
    });
  });
});
