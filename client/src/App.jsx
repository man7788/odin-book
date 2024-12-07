import styles from './App.module.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Sidebar from './components/sidebar/Sidebar';
import Create from './components/create/Create';
import Avatar from './components/avatar/avatar';

function App({ errorRedirect = false }) {
  const { authResult, authLoading, authError } = useAuth();
  const [navLogin, setNavLogin] = useState(false);
  const [renderApp, setRenderApp] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (errorRedirect) {
      setContentError(true);
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

  if (serverError) {
    return (
      <div className={styles.errorContainer}>
        <h1>Oh no, this page doesn&apos;t exist!</h1>
        <Link to="/">
          You can go back to the home page by clicking here, though!
        </Link>
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
            setNavLogin={setNavLogin}
          >
            <Avatar profileId={authResult?.profile} type={'sidebar'} />
          </Sidebar>
          {showCreate && <Create setShowCreate={setShowCreate} />}
          {contentError ? (
            <div className={styles.contentErrorContainer}>
              <div className={styles.contentError}>
                <h1>Oh no, this page doesn&apos;t exist!</h1>
                <Link to="/">
                  You can go back to the home page by clicking here, though!
                </Link>
              </div>
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
