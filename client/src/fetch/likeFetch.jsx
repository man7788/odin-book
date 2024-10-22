const likeFetch = async (postId) => {
  const token = JSON.parse(localStorage.getItem('token'));

  try {
    const response = await fetch(
      `http://localhost:3000/posts/${postId}/likes`,
      {
        mode: 'cors',
        method: 'POST',
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

    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};

export default likeFetch;
