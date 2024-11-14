import styles from './Create.module.css';
import PropTypes from 'prop-types';
import { useState } from 'react';
import createFetch from '../../fetch/createFetch';

function Create({ setShowCreate }) {
  const [post, setPost] = useState('');
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const createPayload = { text_content: post };

    const { result, error } = await createFetch(createPayload);

    if (error?.errors) {
      setFormError(error.errors);
    }

    if (error?.code) {
      setServerError(true);
    }

    if (result) {
      console.log(result);
      setPost('');
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
              name="post"
              id="post"
              placeholder="What's new?"
              value={post}
              onChange={(e) => setPost(e.target.value)}
              autoFocus
            ></textarea>
          </div>
          <button className={styles.postButton} type="submit">
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
