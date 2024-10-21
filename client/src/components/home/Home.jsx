import styles from './Home.module.css';
import Create from '../create/Create';
import PostList from '../post/postList';

function Home() {
  return (
    <div className={styles.Home}>
      <Create />
      <PostList />
    </div>
  );
}

export default Home;
