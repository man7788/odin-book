import styles from './Sidebar.module.css';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

function Sidebar({ fullName }) {
  const [navLogin, setNavLogin] = useState(false);

  const onLogout = () => {
    localStorage.clear();
    setNavLogin(true);
  };

  return (
    <div className={styles.Sidebar}>
      <Link className={styles.logo} to="/">
        Odin Book
      </Link>
      <Link className={styles.home} to="/">
        Home
      </Link>
      <Link className={styles.users} to="users">
        Users
      </Link>
      <Link className={styles.requests} to="users/requests">
        Requests
      </Link>
      <div className={styles.fullName}>{fullName}</div>
      <Link className={styles.logout} onClick={onLogout} to="/login">
        Log Out
      </Link>
      {navLogin && <Navigate to="/login" replace={true} />}
    </div>
  );
}

Sidebar.propTypes = {
  fullName: PropTypes.string,
};

export default Sidebar;
