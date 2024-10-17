import styles from './PostList.module.css';
import usePost from '../../hooks/usePosts';
import Post from './Post';

function PostList() {
  const { postResult, postLoading, postError } = usePost();

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

export default PostList;
