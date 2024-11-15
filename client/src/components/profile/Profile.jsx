import styles from './Profile.module.css';
import { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import useFollowing from '../../hooks/useFollowing';
import requestFetch from '../../fetch/requestFetch';
import PostList from '../posts/PostList';

function Profile() {
  const { profileId } = useParams();
  const { setRenderApp } = useOutletContext();
  const { profileResult, profileLoading, profileError } = useProfile(profileId);
  const { followingResult, followingLoading, followingError } =
    useFollowing(profileId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pending, setPending] = useState(false);

  useEffect(() => {
    // Re-render App to disable sidebar highlight
    setRenderApp(true);
  }, []);

  const onSubmitRequest = async () => {
    setLoading(true);

    const requestPayload = { following_id: profileId };

    const { result, error } = await requestFetch(requestPayload);

    if (error) {
      setError(true);
      return;
    }

    if (result) {
      setPending(true);
    }

    setLoading(false);
  };

  if (profileLoading || followingLoading) {
    return (
      <div className={styles.Profile}>
        <div className={styles.pageLoading}>
          <div className={styles.pageloader}></div>
        </div>
      </div>
    );
  }

  if (profileError || followingError) {
    return (
      <div className={styles.Profile}>
        <div className={styles.pageError}>Server Error</div>
      </div>
    );
  }

  return (
    <div className={styles.Profile}>
      <div className={styles.info}>
        <h1 className={styles.fullName}>{profileResult?.profile.full_name}</h1>
        <div>{profileResult?.profile.about}</div>
        {error ? (
          <div className={styles.error}>Server error</div>
        ) : loading ? (
          <div className={styles.loading}>
            <div className={styles.followLoader}></div>
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
      <div className={styles.postList}>
        <h2>Posts</h2>
        <PostList profileId={profileId} />
      </div>
    </div>
  );
}

export default Profile;
