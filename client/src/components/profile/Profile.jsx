import styles from './Profile.module.css';
import { useParams } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import PostList from '../post/postList';

function Profile() {
  const { profileId } = useParams();
  const { profileResult, profileLoading, profileError } = useProfile(profileId);

  if (profileLoading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (profileError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.Profile}>
      {profileResult?.profile.full_name}
      <br></br>
      {profileResult?.profile.about}
      <PostList profileId={profileId} />
    </div>
  );
}

export default Profile;
