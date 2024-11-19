import styles from './PostList.module.css';
import PropTypes from 'prop-types';
import usePosts from '../../hooks/usePosts';
import Post from './Post';

function PostList({ profileId = 'recent' }) {
  const { postsResult, postsLoading, postsError } = usePosts(profileId);

  if (postsLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (postsError) {
    return <div className={styles.error}>Server Error</div>;
  }

  return (
    <div className={styles.PostList}>
      {postsResult?.posts.length > 0 ? (
        postsResult?.posts.map((post) => <Post key={post._id} {...post} />)
      ) : (
        <div className={styles.emptyList}>No posts yet</div>
      )}
    </div>
  );
}

PostList.propTypes = {
  profileId: PropTypes.string,
};

export default PostList;
