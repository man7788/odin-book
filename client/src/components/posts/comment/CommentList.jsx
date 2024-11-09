import styles from './CommentList.module.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Comment from './Comment';
import commentFetch from '../../../fetch/commentFetch';

function CommentList({ postId, comments }) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formError, setFormError] = useState(null);

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

    setLoading(true);

    const commentPayload = { text_content: comment };
    const { result, error } = await commentFetch(postId, commentPayload);

    if (error?.errors) {
      setFormError(error.errors);
      setLoading(false);
      return;
    }

    if (error) {
      setError(true);
      setLoading(false);
    }

    if (result) {
      setComment('');
    }

    setLoading(false);
  };

  if (error) {
    return (
      <div className={styles.CommentList}>
        {!showComments ? (
          comments.length > 0 && (
            <button onClick={() => setShowComments(true)}>
              {`View ${comments.length} ${
                comments.length === 1 ? 'comment' : 'comments'
              }`}
            </button>
          )
        ) : (
          <button onClick={() => setShowComments(false)}>
            {`Hide ${comments.length === 1 ? 'comment' : 'comments'}`}
          </button>
        )}

        {showComments &&
          comments.map((comment) => <Comment key={comment._id} {...comment} />)}
        <div className={styles.inputContainer}>
          <div className={styles.error}>Server error</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.CommentList}>
      {!showComments ? (
        comments.length > 0 && (
          <button onClick={() => setShowComments(true)}>
            {`View ${comments.length} ${
              comments.length === 1 ? 'comment' : 'comments'
            }`}
          </button>
        )
      ) : (
        <button onClick={() => setShowComments(false)}>
          {`Hide ${comments.length === 1 ? 'comment' : 'comments'}`}
        </button>
      )}

      {showComments &&
        comments.map((comment) => <Comment key={comment._id} {...comment} />)}

      {!loading ? (
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
            formError.map((error) => (
              <div className={styles.formError} key={error.msg}>
                {error.msg}
              </div>
            ))}
        </div>
      ) : (
        <div className={styles.inputContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  );
}

CommentList.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CommentList;
