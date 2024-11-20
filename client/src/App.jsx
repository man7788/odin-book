import styles from './App.module.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Sidebar from './components/sidebar/Sidebar';
import Create from './components/create/Create';
import Avatar from './components/avatar/avatar';

function App({ errorRedirect = false }) {
  const { authResult, authLoading, authError } = useAuth();
  const [navLogin, setNavLogin] = useState(false);
  const [renderApp, setRenderApp] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (errorRedirect) {
      setServerError(true);
    }
  }, []);

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

  if (navLogin) {
    return <> {navLogin && <Navigate to="/login" replace={true} />}</>;
  }

  return (
    <>
      {authResult && (
        <div className={styles.App}>
          <Sidebar
            fullName={authResult?.full_name}
            render={renderApp}
            setShowCreate={setShowCreate}
          >
            <Avatar profileId={authResult?.profile} type={'sidebar'} />
          </Sidebar>
          {showCreate && <Create setShowCreate={setShowCreate} />}
          {serverError ? (
            <div className={styles.errorContainer}>
              <div className={styles.error}>Server Error</div>
            </div>
          ) : (
            <div className={styles.content}>
              <Outlet context={{ profile: authResult.profile, setRenderApp }} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

App.propTypes = {
  errorRedirect: PropTypes.bool,
};

export default App;
