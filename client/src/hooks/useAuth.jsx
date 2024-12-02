import { useEffect, useState } from 'react';

const useAuth = () => {
  const [authResult, setAuthResult] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let token = localStorage.getItem('token');

    const fetchAuth = async () => {
      try {
        const response = await fetch(`http://localhost:3000/`, {
          mode: 'cors',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status >= 400) {
          const error = new Error(response.statusText);
          error.code = response.status;
          throw error;
        }

        const responseData = await response.json();

        setAuthResult(responseData);
      } catch (error) {
        setAuthError(error);
      } finally {
        setAuthLoading(false);
      }
    };

    if (token && token !== 'undefined') {
      token = JSON.parse(localStorage.getItem('token'));
    }

    fetchAuth();
  }, []);

  return { authResult, authLoading, authError };
};

export default useAuth;
