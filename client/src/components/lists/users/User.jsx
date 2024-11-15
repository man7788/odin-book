import styles from './User.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useFollowing from '../../../hooks/useFollowing';
import requestFetch from '../../../fetch/requestFetch';

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

    setLoading(false);
  };

  if (followingLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (followingError || error) {
    return (
      <div className={styles.error}>
        <div className={styles.error}>Server error</div>
      </div>
    );
  }

  return (
    <div className={styles.User}>
      <Link className={styles.fullName} to={`/${_id}`}>
        {full_name}
      </Link>
      {loading ? (
        <div className={styles.loadingButton}>
          <div className={styles.loader}></div>
        </div>
      ) : followingResult?.currentUser ? null : followingResult?.pending ||
        pending ? (
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
