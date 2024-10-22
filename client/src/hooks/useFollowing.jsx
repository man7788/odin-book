import { useEffect, useState } from 'react';

const useFollowing = (profileId) => {
  const [followingResult, setFollowingResult] = useState(null);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [followingError, setFollowingError] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    const fetchFollowing = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/followers/following/${profileId}`,
          {
            mode: 'cors',
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status >= 400) {
          const error = new Error(response.statusText);
          error.code = response.status;
          throw error;
        }

        const responseData = await response.json();

        setFollowingResult(responseData);
      } catch (error) {
        setFollowingError(error);
      } finally {
        setFollowingLoading(false);
      }
    };
    fetchFollowing();
  }, [profileId]);

  return { followingResult, followingLoading, followingError };
};

export default useFollowing;
