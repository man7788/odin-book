import styles from './Profile.module.css';
import { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import useFollowing from '../../hooks/useFollowing';
import requestFetch from '../../fetch/requestFetch';
import PostList from '../posts/PostList';

function Profile() {
  const { profileId } = useParams();
  const { setRender } = useOutletContext();
  const { profileResult, profileLoading, profileError } = useProfile(profileId);
  const { followingResult, followingLoading, followingError } =
    useFollowing(profileId);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    // Re-render App to disable sidebar highlight
    setRender(true);
  }, []);

  const onSubmitRequest = async () => {
    setLoading(true);

    const requestPayload = { following_id: profileId };

    const { result, error } = await requestFetch(requestPayload);

    if (error) {
      setServerError(true);
      return;
    }

    if (result) {
      console.log(result);
    }

    setLoading(false);
  };

  if (profileLoading || followingLoading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (profileError || followingError) {
    return <div className={styles.App}>Server Error</div>;
  }

  if (serverError) {
    return (
      <div className={styles.Profile}>
        <div className={styles.info}>
          <h1 className={styles.fullName}>
            {profileResult?.profile.full_name}
          </h1>
          <div>{profileResult?.profile.about}</div>
          <div className={styles.error}>Server error</div>
        </div>
        <div className={styles.postList}>
          <h2>Posts</h2>
          <PostList profileId={profileId} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Profile}>
      <div className={styles.info}>
        <h1 className={styles.fullName}>{profileResult?.profile.full_name}</h1>
        <div>{profileResult?.profile.about}</div>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loader}></div>
          </div>
        ) : followingResult?.currentUser ? null : followingResult?.pending ? (
          <button className={styles.pending}>Pending</button>
        ) : followingResult?.following ? (
          <button className={styles.following}>Following</button>
        ) : (
          <button className={styles.follow} onClick={onSubmitRequest}>
            Follow
          </button>
        )}
      </div>
      <div className={styles.postList}>
        <h2>Posts</h2>
        <PostList profileId={profileId} />
      </div>
    </div>
  );
}

export default Profile;
