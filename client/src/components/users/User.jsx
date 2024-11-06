import styles from './User.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useFollowing from '../../hooks/useFollowing';
import requestFetch from '../../fetch/requestFetch';

function User(props) {
  const { full_name, _id } = props;
  const { followingResult, followingLoading, followingError } =
    useFollowing(_id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pending, setPending] = useState(false);

  const onSubmitRequest = async () => {
    setLoading(true);
    const requestPayload = { following_id: _id };

    const { result, error } = await requestFetch(requestPayload);

    if (error) {
      setError(true);
    }

    if (result) {
      setPending(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  if (followingLoading || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (followingError || error) {
    return <div className={styles.error}>Server error</div>;
  }

  if (pending) {
    return (
      <div className={styles.User}>
        <Link to={`/${_id}`}>{full_name}</Link>
        <button className={styles.pending}>Pending</button>
      </div>
    );
  }

  return (
    <div className={styles.User}>
      <Link to={`/${_id}`}>{full_name}</Link>
      {followingResult?.currentUser ? null : followingResult?.pending ? (
        <button className={styles.pending}>Pending</button>
      ) : followingResult?.following ? (
        <button className={styles.following}>Following</button>
      ) : (
        <button className={styles.follow} onClick={onSubmitRequest}>
          Follow
        </button>
      )}
    </div>
  );
}

User.propTypes = {
  full_name: PropTypes.string,
  _id: PropTypes.string,
};

export default User;
