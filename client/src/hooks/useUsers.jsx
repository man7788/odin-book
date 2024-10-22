import { useEffect, useState } from 'react';

const useUsers = () => {
  const [usersResult, setUsersResult] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users`, {
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

        setUsersResult(responseData);
      } catch (error) {
        setUsersError(error);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { usersResult, usersLoading, usersError };
};

export default useUsers;
