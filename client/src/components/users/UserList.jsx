import styles from './UserList.module.css';
import useUsers from '../../hooks/useUsers';
import User from './User';

function UserList() {
  const { usersResult, usersLoading, usersError } = useUsers();

  if (usersLoading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (usersError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.UserList}>
      {usersResult?.profiles.map((profiles) => (
        <User key={profiles._id} {...profiles} />
      ))}
    </div>
  );
}

export default UserList;
