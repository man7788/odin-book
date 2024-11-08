import styles from './Request.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useProfile from '../../../hooks/useProfile';
import acceptFetch from '../../../fetch/acceptFetch';

function Request({ request, setRefresh }) {
  const { from, _id } = request;
  const { profileResult, profileLoading, profileError } = useProfile(from);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmitAccept = async () => {
    setLoading(true);

    const acceptPayload = { request_id: _id };

    const { result, error } = await acceptFetch(acceptPayload);

    if (error) {
      setError(true);
    }

    if (result) {
      setRefresh(true);
    }

    setLoading(false);
  };

  if (profileLoading || loading) {
    return (
      <div className={styles.Request}>
        <Link className={styles.fullName} to={`/${profileResult?.profile._id}`}>
          {profileResult?.profile.full_name}
        </Link>
        <div className={styles.loading}>
          <div className={styles.loader}></div>
        </div>
      </div>
    );
  }

  if (profileError || error) {
    return (
      <div className={styles.Request}>
        <Link className={styles.fullName} to={`/${profileResult?.profile._id}`}>
          {profileResult?.profile.full_name}
        </Link>
        <div className={styles.error}>Server Error</div>
      </div>
    );
  }

  return (
    <div className={styles.Request}>
      <Link className={styles.fullName} to={`/${profileResult?.profile._id}`}>
        {profileResult?.profile.full_name}
      </Link>
      <button className={styles.accept} onClick={onSubmitAccept}>
        Accept
      </button>
    </div>
  );
}

Request.propTypes = {
  request: PropTypes.object,
  setRefresh: PropTypes.func,
};

export default Request;
