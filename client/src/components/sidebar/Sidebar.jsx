import styles from './Sidebar.module.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

function Sidebar({ fullName, renderApp, setShowCreate }) {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);
  const [navLogin, setNavLogin] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      setActiveLink('home');
      return;
    }

    if (location.pathname === '/users') {
      setActiveLink('users');
      return;
    }

    if (location.pathname === '/requests') {
      setActiveLink('requests');
      return;
    }

    setActiveLink(null);
  }, [location, renderApp]);

  const onShowCreate = () => {
    setShowCreate(true);
  };

  const onLogout = () => {
    localStorage.clear();
    setNavLogin(true);
  };

  return (
    <div className={styles.Sidebar}>
      <Link className={styles.logo} to="/">
        Odin Book
      </Link>
      <Link
        className={activeLink === 'home' ? styles.homeActive : styles.home}
        to="/"
      >
        Home
      </Link>
      <Link
        className={activeLink === 'users' ? styles.usersActive : styles.users}
        to="users"
      >
        Users
      </Link>
      <Link
        className={
          activeLink === 'requests' ? styles.requestsActive : styles.requests
        }
        to="requests"
      >
        Requests
      </Link>
      <button onClick={onShowCreate} className={styles.create}>
        Create
      </button>
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
  renderApp: PropTypes.bool,
  setShowCreate: PropTypes.func,
};

export default Sidebar;
