import styles from './GitHubCallback.module.css';
import { Navigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import githubFetch from '../../../fetch/githubFetch';

function GitHubCallback() {
  const [navHome, setNavHome] = useState(false);
  const [navError, setNavError] = useState(false);
  const effectRan = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');

    const fetch = async () => {
      const { result, error } = await githubFetch(code);

      if (error) {
        setNavError(true);
      }

      if (result?.token) {
        localStorage.setItem('token', JSON.stringify(result.token));
        setNavHome(true);
      }
    };

    if (effectRan.current === false) {
      fetch();
    }

    return () => {
      effectRan.current = true; // this will be set to true on the initial unmount
    };
  }, []);

  if (navHome) {
    return <Navigate to="/" replace={true} />;
  }

  if (navError) {
    return <Navigate to="/error" replace={true} />;
  }

  return (
    <div className={styles.GitHubCallback}>
      <h1>Processing GitHub login...</h1>
    </div>
  );
}

export default GitHubCallback;
