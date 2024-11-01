import styles from './CommentList.module.css';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Comment from './Comment';
import commentFetch from '../../../fetch/commentFetch';

function CommentList({ postId, comments }) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const commentPayload = { text_content: comment };

    const { result, error } = await commentFetch(postId, commentPayload);

    if (error?.errors) {
      setFormError(error.errors);
    }

    if (error?.code) {
      setServerError(true);
    }

    if (result?.createdComment) {
      console.log(result);
      setComment('');
    }

    setLoading(false);
  };

  if (loading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (serverError) {
    return <div className={styles.App}>Server Error</div>;
  }

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

          <div className={styles.loginBtn}>
            <button className={styles.button} type="submit">
              Post
            </button>
          </div>
        </form>
        {formError &&
          formError.map((error) => <div key={error.msg}>{error.msg}</div>)}
      </div>
    </div>
  );
}

CommentList.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CommentList;
