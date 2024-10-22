import styles from './PostList.module.css';
import PropTypes from 'prop-types';
import usePosts from '../../hooks/usePosts';
import Post from './Post';

function PostList({ profileId = 'recent' }) {
  const { postsResult, postsLoading, postsError } = usePosts(profileId);

  if (postsLoading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (postsError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.PostList}>
      {postsResult?.posts.map((post) => (
        <Post key={post._id} {...post} />
      ))}
    </div>
  );
}

PostList.propTypes = {
  profileId: PropTypes.string,
};

export default PostList;
