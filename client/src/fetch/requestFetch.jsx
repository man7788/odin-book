const requestFetch = async (requestPayload) => {
  const token = JSON.parse(localStorage.getItem('token'));

  try {
    const response = await fetch(`http://localhost:3000/followers/requests`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestPayload),
    });

    if (response.status >= 400) {
      console.log(response.status);
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

export default requestFetch;
