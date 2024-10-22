import styles from './Request.module.css';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useProfile from '../../../hooks/useProfile';
import acceptFetch from '../../../fetch/acceptFetch';

function Request(props) {
  const { from, _id } = props;
  const { profileResult, profileLoading, profileError } = useProfile(from);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onSubmitAccept = async () => {
    setLoading(true);

    const acceptPayload = { request_id: _id };

    const { result, error } = await acceptFetch(acceptPayload);

    if (error?.code) {
      setServerError(true);
    }

    if (result) {
      console.log(result);
    }

    setLoading(false);
  };

  if (profileLoading || loading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (profileError || serverError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.Request} style={{ border: '2px solid orange' }}>
      {profileResult.profile.full_name}
      <br></br>
      <button onClick={onSubmitAccept}>Accept</button>
    </div>
  );
}

Request.propTypes = {
  from: PropTypes.string,
  _id: PropTypes.string,
};

export default Request;
