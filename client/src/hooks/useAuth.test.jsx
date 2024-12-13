import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useAuth from './useAuth';

afterEach(() => {
  vi.clearAllMocks();
});

window.global.fetch = vi.fn();
const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

describe('useAuth', () => {
  test('should response with loading true', async () => {
    getItemSpy.mockReturnValue(JSON.stringify({ token: 'foobar' }));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      expect(localStorage.getItem).toHaveBeenCalledTimes(2);
      expect(result.current).toEqual({
        authResult: null,
        authLoading: true,
        authError: null,
      });
    });
  });
});
