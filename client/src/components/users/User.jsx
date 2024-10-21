import styles from './User.module.css';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useFollowing from '../../hooks/useFollowing';
import requestFetch from '../../fetch/requestFetch';

function User(props) {
  const { full_name, _id } = props;
  const { followingResult, followingLoading, followingError } =
    useFollowing(_id);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onSubmitRequest = async () => {
    setLoading(true);

    const requestPayload = { following_id: _id };

    const { result, error } = await requestFetch(requestPayload);

    if (error?.code) {
      setServerError(true);
    }

    if (result) {
      console.log(result);
    }

    setLoading(false);
  };

  if (followingLoading || loading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (followingError || serverError) {
    return <div className={styles.App}>Server Error</div>;
  }
  return (
    <div className={styles.User} style={{ border: '2px solid orange' }}>
      {full_name}
      <br></br>
      {followingResult?.currentUser ? null : followingResult?.pending ? (
        'Pending'
      ) : followingResult?.following ? (
        'Following'
      ) : (
        <button onClick={onSubmitRequest}>Follow</button>
      )}
    </div>
  );
}

User.propTypes = {
  full_name: PropTypes.string,
  _id: PropTypes.string,
};

export default User;
