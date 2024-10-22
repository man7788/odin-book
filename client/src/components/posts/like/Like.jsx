import styles from './Like.module.css';
import PropTypes from 'prop-types';
import { useState } from 'react';
import likeFetch from '../../../fetch/likeFetch';

function Like({ postId, likes }) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onLike = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { result, error } = await likeFetch(postId);

    if (error?.code) {
      setServerError(true);
    }

    if (result) {
      console.log(result);
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
    <div className={styles.Like}>
      <button onClick={onLike}>Like</button>
      <br></br>
      {likes ? likes?.length : 0} Likes
    </div>
  );
}

Like.propTypes = {
  postId: PropTypes.string.isRequired,
  likes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Like;
