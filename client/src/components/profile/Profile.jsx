import styles from './Profile.module.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import useFollowing from '../../hooks/useFollowing';
import requestFetch from '../../fetch/requestFetch';
import PostList from '../post/postList';

function Profile() {
  const { profileId } = useParams();
  const { profileResult, profileLoading, profileError } = useProfile(profileId);
  const { followingResult, followingLoading, followingError } =
    useFollowing(profileId);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onSubmitRequest = async () => {
    setLoading(true);

    const requestPayload = { following_id: profileId };

    const { result, error } = await requestFetch(requestPayload);

    if (error?.code) {
      setServerError(true);
    }

    if (result) {
      console.log(result);
    }

    setLoading(false);
  };

  if (profileLoading || followingLoading || loading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (profileError || followingError || serverError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.Profile}>
      {profileResult?.profile.full_name}
      <br></br>
      {profileResult?.profile.about}
      <br></br>
      {followingResult?.currentUser ? null : followingResult?.pending ? (
        'Pending'
      ) : followingResult?.following ? (
        'Following'
      ) : (
        <button onClick={onSubmitRequest}>Follow</button>
      )}

      <PostList profileId={profileId} />
    </div>
  );
}

export default Profile;
