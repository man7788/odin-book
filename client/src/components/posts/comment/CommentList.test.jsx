import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CommentList from './CommentList';

afterEach(() => {
  vi.clearAllMocks();
});

const comments = [
  {
    _id: 'comment_id1',
    post: 'post_id',
    profile: 'profile_id1',
    author: 'foo bar',
    text_content: 'good post',
    __v: 0,
  },
  {
    _id: 'comment_id2',
    post: 'post_id',
    profile: 'profile_id1',
    author: 'foo bar',
    text_content: 'good post',
    __v: 0,
  },
];

describe('CommentList', () => {
  test('should render no comment', () => {
    const { container } = render(
      <CommentList postId={'post_id1'} comments={[]} setRenderPost={vi.fn()} />,
    );

    expect(container).toMatchSnapshot();
  });

  test('should render 1 comment', () => {
    const { container } = render(
      <CommentList
        postId={'post_id1'}
        comments={[comments[0]]}
        setRenderPost={vi.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  test('should render comments', () => {
    const { container } = render(
      <CommentList
        postId={'post_id1'}
        comments={comments}
        setRenderPost={vi.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  test('should show 1 comment', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <BrowserRouter>
        <CommentList
          postId={'post_id1'}
          comments={[comments[0]]}
          setRenderPost={vi.fn()}
        />
      </BrowserRouter>,
    );

    const viewButton = await screen.findByRole('button');

    await user.click(viewButton);

    expect(container).toMatchSnapshot();
  });

  test('should show comments', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <BrowserRouter>
        <CommentList
          postId={'post_id1'}
          comments={comments}
          setRenderPost={vi.fn()}
        />
        ,
      </BrowserRouter>,
    );

    const viewButton = await screen.findByRole('button');

    await user.click(viewButton);

    expect(container).toMatchSnapshot();
  });

  test('should hide 1 comment', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <BrowserRouter>
        <CommentList
          postId={'post_id1'}
          comments={[comments[0]]}
          setRenderPost={vi.fn()}
        />
        ,
      </BrowserRouter>,
    );

    const viewButton = await screen.findByRole('button');

    await user.click(viewButton);

    const hideButton = await screen.findByRole('button');

    await user.click(hideButton);

    expect(container).toMatchSnapshot();
  });

  test('should hide comments', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <BrowserRouter>
        <CommentList
          postId={'post_id1'}
          comments={comments}
          setRenderPost={vi.fn()}
        />
        ,
      </BrowserRouter>,
    );

    const viewButton = await screen.findByRole('button');

    await user.click(viewButton);

    const hideButton = await screen.findByRole('button');

    await user.click(hideButton);

    expect(container).toMatchSnapshot();
  });

  describe('comment form', () => {
    test('should show user input', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <CommentList
            postId={'post_id1'}
            comments={comments}
            setRenderPost={vi.fn()}
          />
          ,
        </BrowserRouter>,
      );

      const button = screen.queryByRole('button', {
        name: /post/i,
      });

      expect(button).not.toBeInTheDocument();

      const input = await screen.findByPlaceholderText('Add a comment...');

      await user.type(input, 'foobar');

      const submitButton = await screen.findByRole('button', {
        name: /post/i,
      });

      expect(input).toHaveValue('foobar');
      expect(submitButton).toBeInTheDocument();
    });
  });
});
