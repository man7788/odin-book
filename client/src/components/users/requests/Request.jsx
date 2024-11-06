import styles from './Request.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useProfile from '../../../hooks/useProfile';
import acceptFetch from '../../../fetch/acceptFetch';

function Request(props) {
  const { from, _id } = props;
  const { profileResult, profileLoading, profileError } = useProfile(from);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmitAccept = async () => {
    setLoading(true);

    const acceptPayload = { request_id: _id };

    const { result, error } = await acceptFetch(acceptPayload);

    if (error?.code) {
      setError(true);
    }

    if (result) {
      console.log(result);
    }

    setLoading(false);
  };

  if (profileLoading || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (profileError || error) {
    return <div className={styles.error}>Server Error</div>;
  }

  return (
    <div className={styles.Request}>
      <Link to={`/${profileResult.profile._id}`}>
        {profileResult.profile.full_name}
      </Link>
      <button className={styles.accept} onClick={onSubmitAccept}>
        Accept
      </button>
    </div>
  );
}

Request.propTypes = {
  from: PropTypes.string,
  _id: PropTypes.string,
};

export default Request;
