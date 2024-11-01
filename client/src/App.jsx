import styles from './App.module.css';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Sidebar from './components/sidebar/Sidebar';

function App() {
  const { authResult, authLoading, authError } = useAuth();
  const [navLogin, setNavLogin] = useState(false);
  const [serverError, setServerError] = useState(false);

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
      <Sidebar fullName={authResult?.full_name} />
      {!authError && <Outlet context={{ profile: authResult.profile }} />}
      {navLogin && <Navigate to="/login" replace={true} />}
    </div>
  );
}

export default App;
