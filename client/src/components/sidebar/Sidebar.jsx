import styles from './Sidebar.module.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({
  children,
  fullName,
  renderApp,
  setShowCreate,
  setNavLogin,
}) {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);

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
      <div className={styles.fullName}>
        {children}
        {fullName}
      </div>
      <Link className={styles.logout} onClick={onLogout} to="/login">
        Log Out
      </Link>
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node,
  fullName: PropTypes.string,
  renderApp: PropTypes.bool,
  setShowCreate: PropTypes.func,
  setNavLogin: PropTypes.func,
};

export default Sidebar;
