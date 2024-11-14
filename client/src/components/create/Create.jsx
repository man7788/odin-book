import styles from './Create.module.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import createFetch from '../../fetch/createFetch';

function Create({ setShowCreate }) {
  const [content, setContent] = useState('');
  const [post, setPost] = useState(false);

  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (content.length > 0) {
      setPost(true);
    } else {
      setPost(false);
    }
  }, [content]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const createPayload = { text_content: content };

    const { result, error } = await createFetch(createPayload);

    if (error?.errors) {
      setFormError(error.errors);
      return;
    }

    if (error) {
      setServerError(true);
    }

    if (result) {
      setContent('');
    }

    setLoading(false);
  };

  const onHideCreate = () => {
    setShowCreate(false);
  };

  if (loading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (serverError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.Create}>
      <div onClick={onHideCreate} className={styles.filter}></div>
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
          <button
            className={post ? styles.postButtonActive : styles.postButton}
            type="submit"
          >
            Post
          </button>
        </form>
        {formError &&
          formError.map((error) => <div key={error.msg}>{error.msg}</div>)}
      </div>
    </div>
  );
}

Create.propTypes = {
  setShowCreate: PropTypes.func,
};

export default Create;
