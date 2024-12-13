const githubFetch = async (code) => {
  try {
    const response = await fetch('http://localhost:3000/auth/github/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
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

export default githubFetch;
