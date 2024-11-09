import { useEffect, useState } from 'react';

const useSinglePost = (profileId) => {
  const [postResult, setPostResult] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);
  const [renderPost, setRenderPost] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/posts/${profileId}`,
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

        setPostResult(responseData);
      } catch (error) {
        setPostError(error);
      } finally {
        setPostLoading(false);
      }
    };
    fetchPosts();
  }, [profileId, renderPost]);

  return { postResult, postLoading, postError, setRenderPost };
};

export default useSinglePost;
