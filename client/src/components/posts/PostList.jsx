import styles from './PostList.module.css';
import PropTypes from 'prop-types';
import usePost from '../../hooks/usePosts';
import Post from './Post';

function PostList({ profileId = 'recent' }) {
  const { postResult, postLoading, postError } = usePost(profileId);

  if (postLoading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (postError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.PostList}>
      {postResult?.posts.map((post) => (
        <Post key={post._id} {...post} />
      ))}
    </div>
  );
}

PostList.propTypes = {
  profileId: PropTypes.string,
};

export default PostList;
