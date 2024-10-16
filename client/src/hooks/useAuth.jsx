import { useEffect, useState } from 'react';

const useAuth = () => {
  const [authResult, setAuthResult] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/`, {
          mode: 'cors',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status >= 400) {
          throw new Error(response.statusText);
        }

        const responseData = await response.json();

        setAuthResult(responseData);
      } catch (error) {
        console.log(error);
        setAuthError(error);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return { authResult, authLoading, authError };
};

export default useAuth;
