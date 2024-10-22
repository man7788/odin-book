import { useEffect, useState } from 'react';

const usePosts = (profileId) => {
  const [postsResult, setPostsResult] = useState(null);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    const path = profileId === 'recent' ? 'recent' : `users/${profileId}`;

    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${path}`, {
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

        setPostsResult(responseData);
      } catch (error) {
        setPostsError(error);
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, [profileId]);

  return { postsResult, postsLoading, postsError };
};

export default usePosts;
