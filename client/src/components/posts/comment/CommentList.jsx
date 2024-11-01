import styles from './CommentList.module.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Comment from './Comment';
import commentFetch from '../../../fetch/commentFetch';

function CommentList({ postId, comments }) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [formError, setFormError] = useState(null);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (comment.length > 0) {
      setShowReply(true);
    } else {
      setShowReply(false);
    }
  }, [comment]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (comment.length === 0) {
      return;
    }

    const commentPayload = { text_content: comment };

    const { result, error } = await commentFetch(postId, commentPayload);

    if (error?.errors) {
      setFormError(error.errors);
      return;
    }

    if (error) {
      setServerError(true);
    }

    if (result) {
      setComment('');
    }
  };

  return (
    <div className={styles.CommentList}>
      {!showComments ? (
        comments.length > 0 ? (
          <button onClick={() => setShowComments(true)}>
            {comments.length === 1
              ? `View ${comments.length} comment`
              : `View ${comments.length} comments`}
          </button>
        ) : null
      ) : (
        <button onClick={() => setShowComments(false)}>
          {comments.length === 1 ? `Hide comment` : `Hide comments`}
        </button>
      )}

      {showComments &&
        comments.map((comment) => <Comment key={comment._id} {...comment} />)}

      {!serverError ? (
        <div className={styles.formContainer}>
          <form action="" method="post" onSubmit={onSubmitForm}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="comment"
                id="comment"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></input>
            </div>
            {showReply && (
              <button className={styles.loginButton} type="submit">
                Post
              </button>
            )}
          </form>
          {formError &&
            formError.map((error) => <div key={error.msg}>{error.msg}</div>)}
        </div>
      ) : (
        <div className={styles.formContainer}>Server Error</div>
      )}
    </div>
  );
}

CommentList.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CommentList;
