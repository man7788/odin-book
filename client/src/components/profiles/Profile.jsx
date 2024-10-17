import styles from './Profile.module.css';
import { useParams } from 'react-router-dom';
import PostList from '../posts/postList';

function Profile() {
  let { profileId } = useParams();
  profileId = '/users/' + profileId;

  return (
    <div className={styles.Profile}>
      John Doe
      <PostList profileId={profileId} />
    </div>
  );
}

export default Profile;
