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
    <>
      {usersResult?.profiles ? (
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
