import styles from './Create.module.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import createFetch from '../../fetch/createFetch';

function Create({ setShowCreate }) {
  const [content, setContent] = useState('');
  const [post, setPost] = useState(false);

  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (content.length > 0) {
      setPost(true);
    } else {
      setPost(false);
    }

    setFormError(null);
  }, [content]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const createPayload = { text_content: content };

    const { result, error } = await createFetch(createPayload);

    if (error?.errors) {
      setFormError(error.errors);
      setLoading(false);
      return;
    }

    if (error) {
      setError(true);
      return;
    }

    if (result) {
      setContent('');
    }

    setLoading(false);
    setSuccess(true);
  };

  const onHideCreate = () => {
    setShowCreate(false);
  };

  if (success) {
    return (
      <div className={styles.Create}>
        <div onClick={onHideCreate} className={styles.filter}></div>
        <div className={styles.formContainer}>
          <div className={styles.successContainer}>
            <div className={styles.headerContainer}>
              <button className={styles.cancelButton} onClick={onHideCreate}>
                Close
              </button>
              <h2 className={styles.header}>New Post</h2>
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.success}>Your post has been created.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Create} data-testid="createPopup">
      <div
        onClick={onHideCreate}
        className={styles.filter}
        data-testid="blank"
      ></div>
      <div className={styles.formContainer}>
        <form action="" method="post" onSubmit={onSubmitForm}>
          <div className={styles.headerContainer}>
            <button className={styles.cancelButton} onClick={onHideCreate}>
              Cancel
            </button>
            <h2 className={styles.header}>New Post</h2>
          </div>
          <div className={styles.inputContainer}>
            <textarea
              type="text"
              name="content"
              id="content"
              placeholder="What's new?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            ></textarea>
          </div>
          <div className={styles.footerContainer}>
            {formError &&
              formError.map((error) => (
                <div key={error.msg} className={styles.formError}>
                  {error.msg}
                </div>
              ))}
            {error ? (
              <div className={styles.error}>Server error</div>
            ) : loading ? (
              <div className={styles.loading}>
                <div className={styles.loader}></div>
              </div>
            ) : (
              <button
                className={post ? styles.postButtonActive : styles.postButton}
                type="submit"
              >
                Post
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

Create.propTypes = {
  setShowCreate: PropTypes.func,
};

export default Create;
