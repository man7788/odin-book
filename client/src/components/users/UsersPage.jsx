import styles from './UsersPage.module.css';
import UserList from './UserList';

function UsersPage() {
  return (
    <div className={styles.UsersPage}>
      <h1>Users</h1>
      <UserList />
    </div>
  );
}

export default UsersPage;
