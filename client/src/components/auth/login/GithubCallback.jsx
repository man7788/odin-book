import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import githubFetch from '../../../fetch/githubFetch';

function GitHubCallback() {
  const [navHome, setNavHome] = useState(false);
  const [navError, setNavError] = useState(false);

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

    fetch();
  }, []);

  return (
    <>
      <div>Processing GitHub login...</div>
      {navHome && <Navigate to="/" replace={true} />}
      {navError && <Navigate to="/error" replace={true} />}
    </>
  );
}

export default GitHubCallback;
