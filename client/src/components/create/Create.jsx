import styles from './Create.module.css';
import { useState } from 'react';
import createFetch from '../../fetch/createFetch';

function Create() {
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

  if (loading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (serverError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.Comment} style={{ border: '2px solid cyan' }}>
      <div className={styles.formContainer}>
        <form action="" method="post" onSubmit={onSubmitForm}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="post"
              id="post"
              placeholder="Create new post..."
              value={post}
              onChange={(e) => setPost(e.target.value)}
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

export default Create;
