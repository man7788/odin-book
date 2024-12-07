import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as useProfile from '../../hooks/useProfile';
import Avatar from './Avatar';

afterEach(() => {
  vi.clearAllMocks();
});

const useProfileSpy = vi.spyOn(useProfile, 'default');

describe('Avatar', () => {
  test('should render loading', () => {
    useProfileSpy.mockReturnValue({
      profileResult: null,
      profileLoading: true,
      profileError: null,
    });

    const { container } = render(
      <BrowserRouter>
        <Avatar type={'foobar'} />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  test('should render error', () => {
    useProfileSpy.mockReturnValue({
      profileResult: null,
      profileLoading: false,
      profileError: true,
    });

    const { container } = render(
      <BrowserRouter>
        <Avatar type={'foobar'} />
      </BrowserRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
