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
      <Link to="/">Odin Book</Link>
      <Link to="/">Home</Link>
      <Link to="users">Users</Link>
      <Link to="users/requests">Requests</Link>
      <div className={styles.fullName}>{fullName}</div>
      <Link onClick={onLogout} to="/login">
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
