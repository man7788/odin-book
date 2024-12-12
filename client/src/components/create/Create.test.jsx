import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Create from './Create';

afterEach(() => {
  vi.clearAllMocks();
});

describe('Create', () => {
  test('should render Create', () => {
    const { container } = render(<Create />);

    expect(container).toMatchSnapshot();
  });

  test('should render active post button', async () => {
    const user = userEvent.setup();

    render(<Create />);

    const input = await screen.findByPlaceholderText("What's new?");

    await user.type(input, 'placeholder');

    const postButton = await screen.findByRole('button', {
      name: /post/i,
    });

    expect(postButton.className).toMatch(/active/i);
  });
});
