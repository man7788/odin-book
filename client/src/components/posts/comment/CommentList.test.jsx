import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CommentList from './CommentList';
import * as commentFetch from '../../../fetch/commentFetch';

afterEach(() => {
  vi.clearAllMocks();
});

const commentFetchSpy = vi.spyOn(commentFetch, 'default');

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

  describe('Comment form', () => {
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

    test('should render loading', async () => {
      const user = userEvent.setup();

      commentFetchSpy.mockReturnValue({ result: null, error: null });

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

      const button = screen.queryByRole('button', {
        name: /post/i,
      });

      expect(button).not.toBeInTheDocument();

      const input = await screen.findByPlaceholderText('Add a comment...');

      await user.type(input, 'foobar');

      const submitButton = await screen.findByRole('button', {
        name: /post/i,
      });

      await user.click(submitButton);

      expect(container).toMatchSnapshot();
    });

    test('should render form errors', async () => {
      const user = userEvent.setup();

      commentFetchSpy
        .mockReturnValueOnce({
          error: {
            errors: [{ msg: 'comment error' }],
          },
        })
        .mockReturnValueOnce({
          result: null,
          error: null,
        });

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

      const input = await screen.findByPlaceholderText('Add a comment...');

      await user.type(input, 'foobar');

      const submitButton = await screen.findByRole('button', {
        name: /post/i,
      });

      await user.click(submitButton);

      const commentError = await screen.findByText('comment error');

      expect(commentError).toBeInTheDocument();
    });

    test('should render form submit server error', async () => {
      const user = userEvent.setup();

      commentFetchSpy.mockReturnValue({
        error: true,
      });

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

      const input = await screen.findByPlaceholderText('Add a comment...');

      await user.type(input, 'foobar');

      const submitButton = await screen.findByRole('button', {
        name: /post/i,
      });

      await user.click(submitButton);

      expect(container).toMatchSnapshot();
    });

    test('should submit form', async () => {
      const user = userEvent.setup();
      const setRenderPost = vi.fn();

      commentFetchSpy.mockReturnValue({
        result: true,
      });

      render(
        <BrowserRouter>
          <CommentList
            postId={'post_id1'}
            comments={comments}
            setRenderPost={setRenderPost}
          />
          ,
        </BrowserRouter>,
      );

      const input = await screen.findByPlaceholderText('Add a comment...');

      await user.type(input, 'foobar');

      const submitButton = await screen.findByRole('button', {
        name: /post/i,
      });

      await user.click(submitButton);

      const emptyInput = await screen.findByPlaceholderText('Add a comment...');

      expect(emptyInput).toHaveValue('');
      expect(setRenderPost).toHaveBeenCalled();
    });
  });
});
