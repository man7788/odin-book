import { useEffect, useState } from 'react';

const usePost = () => {
  const [postResult, setPostResult] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/recent`, {
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

        setPostResult(responseData);
      } catch (error) {
        setPostError(error);
      } finally {
        setPostLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return { postResult, postLoading, postError };
};

export default usePost;
