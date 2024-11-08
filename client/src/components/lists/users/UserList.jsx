import styles from './UserList.module.css';
import useUsers from '../../../hooks/useUsers';
import User from './User';

function UserList() {
  const { usersResult, usersLoading, usersError } = useUsers();

  if (usersLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (usersError) {
    return <div className={styles.error}>Server Error</div>;
  }

  return (
    <>
      {usersResult?.profiles.length > 0 ? (
        <div className={styles.UserList}>
          {usersResult?.profiles.map((profile) => (
            <User key={profile._id} {...profile} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyList}>No users</div>
      )}
    </>
  );
}

export default UserList;
