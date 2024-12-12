import styles from './Request.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useProfile from '../../../hooks/useProfile';
import acceptFetch from '../../../fetch/acceptFetch';
import Avatar from '../../avatar/Avatar';

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
      setLoading(false);
      return;
    }
  };

  if (profileLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (profileError || error) {
    return <div className={styles.error}>Server Error</div>;
  }

  return (
    <div className={styles.Request}>
      <Avatar profileId={request.from} type={'list'} />
      <Link className={styles.fullName} to={`/${profileResult?.profile._id}`}>
        {profileResult?.profile.full_name}
      </Link>
      {loading ? (
        <div className={styles.loadingButton}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <button className={styles.accept} onClick={onSubmitAccept}>
          Accept
        </button>
      )}
    </div>
  );
}

Request.propTypes = {
  request: PropTypes.object,
  setRefresh: PropTypes.func,
};

export default Request;
