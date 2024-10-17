import styles from './App.module.css';
import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';

function App() {
  const { authResult, authLoading, authError } = useAuth();
  const [navLogin, setNavLogin] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    if (authError?.message === 'Unauthorized') {
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
      <br></br>
      {authResult?.full_name}
      <br></br>
      <Outlet />
      {navLogin && <Navigate to="/login" replace={true} />}
    </div>
  );
}

export default App;
