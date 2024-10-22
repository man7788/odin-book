import styles from './App.module.css';
import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Sidebar from './components/sidebar/Sidebar';

function App() {
  const { authResult, authLoading, authError } = useAuth();
  const [navLogin, setNavLogin] = useState(false);
  const [serverError, setServerError] = useState(false);

  const onLogout = () => {
    localStorage.clear();
    setNavLogin(true);
  };

  useEffect(() => {
    if (authError?.code === 401) {
      setNavLogin(true);
    } else if (authError) {
      setServerError(true);
    }
  }, [authError]);

  if (authLoading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (serverError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.App}>
      <Link to="/">Odin Book</Link>
      <Link onClick={onLogout} to="/login">
        Log Out
      </Link>
      <br></br>
      {authResult?.full_name}
      <Sidebar />
      <br></br>
      {!authError && <Outlet />}
      {navLogin && <Navigate to="/login" replace={true} />}
    </div>
  );
}

export default App;
