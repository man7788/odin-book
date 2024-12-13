import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useRequests from './useRequests';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();
const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

describe('useRequests', () => {
  test('should return loading true', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    const { result } = renderHook(() => useRequests());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual({
        requestsResult: null,
        requestsLoading: true,
        requestsError: null,
        setRefresh: expect.any(Function),
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

    const { result } = renderHook(() => useRequests());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      requestsResult: null,
      requestsLoading: false,
      requestsError: expect.objectContaining({
        message: 'Unauthorized',
        code: 400,
      }),
      setRefresh: expect.any(Function),
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

    const { result } = renderHook(() => useRequests());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(result.current).toEqual({
      requestsResult: { response: 'foobar' },
      requestsLoading: false,
      requestsError: null,
      setRefresh: expect.any(Function),
    });
  });
});
