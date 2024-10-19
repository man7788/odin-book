import styles from './Profile.module.css';
import { useParams } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import useFollowing from '../../hooks/useFollowing';
import PostList from '../post/postList';

function Profile() {
  const { profileId } = useParams();
  const { profileResult, profileLoading, profileError } = useProfile(profileId);
  const { followingResult, followingLoading, followingError } =
    useFollowing(profileId);

  if (profileLoading || followingLoading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (profileError || followingError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.Profile}>
      {profileResult?.profile.full_name}
      <br></br>
      {profileResult?.profile.about}
      <br></br>
      {followingResult?.currentUser ? null : followingResult?.following ? (
        'Following'
      ) : (
        <button>Follow</button>
      )}

      <PostList profileId={profileId} />
    </div>
  );
}

export default Profile;
