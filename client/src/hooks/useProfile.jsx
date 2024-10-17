import { useEffect, useState } from 'react';

const useProfile = (profileId) => {
  const [profileResult, setProfileResult] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${profileId}`,
          {
            mode: 'cors',
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status >= 400) {
          throw new Error(response.statusText);
        }

        const responseData = await response.json();

        setProfileResult(responseData);
      } catch (error) {
        setProfileError(error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchStatus();
  }, [profileId]);

  return { profileResult, profileLoading, profileError };
};

export default useProfile;
