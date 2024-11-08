import styles from './UsersPage.module.css';
import UserList from './UserList';

function UsersPage() {
  return (
    <div className={styles.UsersPage}>
      <UserList />
    </div>
  );
}

export default UsersPage;
