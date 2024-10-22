const acceptFetch = async (acceptPayload) => {
  const token = JSON.parse(localStorage.getItem('token'));

  try {
    const response = await fetch(`http://localhost:3000/followers`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(acceptPayload),
    });

    if (response.status >= 400) {
      const error = new Error(response.statusText);
      error.code = response.status;
      throw error;
    }

    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};

export default acceptFetch;
