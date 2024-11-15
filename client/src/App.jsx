import styles from './App.module.css';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Sidebar from './components/sidebar/Sidebar';
import Create from './components/create/Create';

function App() {
  const { authResult, authLoading, authError } = useAuth();
  const [navLogin, setNavLogin] = useState(false);
  const [renderApp, setRenderApp] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (authError?.code === 401) {
      setNavLogin(true);
    } else if (authError) {
      setServerError(true);
    }
  }, [authError]);

  if (authLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (serverError) {
    return <div className={styles.error}>Server Error</div>;
  }

  return (
    <div className={styles.App}>
      <Sidebar
        fullName={authResult?.full_name}
        render={renderApp}
        setShowCreate={setShowCreate}
      />
      {showCreate && <Create setShowCreate={setShowCreate} />}
      {!authError && (
        <Outlet context={{ profile: authResult.profile, setRenderApp }} />
      )}
      {navLogin && <Navigate to="/login" replace={true} />}
    </div>
  );
}

export default App;
