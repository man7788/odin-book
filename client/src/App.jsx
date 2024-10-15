import { useEffect, useState } from 'react';
import styles from './App.module.css';
import useAuth from './hooks/useAuth';
import { Navigate } from 'react-router-dom';

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
      Odin Book<br></br>
      {authResult?.full_name}
      {navLogin && <Navigate to="/login" replace={true} />}
    </div>
  );
}

export default App;
