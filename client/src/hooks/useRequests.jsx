import { useEffect, useState } from 'react';

const useRequests = () => {
  const [requestsResult, setRequestsResult] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));

    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/followers/requests`,
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

        setRequestsResult(responseData);
      } catch (error) {
        setRequestsError(error);
      } finally {
        setRequestsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return { requestsResult, requestsLoading, requestsError };
};

export default useRequests;
