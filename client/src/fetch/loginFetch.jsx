const loginFetch = async (loginPayload) => {
  try {
    const response = await fetch(`http://localhost:3000/login`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginPayload),
    });

    if (response.status === 400) {
      const errors = await response.json();
      throw errors;
    }

    if (response.status > 400) {
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

export default loginFetch;
