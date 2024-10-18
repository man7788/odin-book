const commentFetch = async (postId, commentPayload) => {
  const token = JSON.parse(localStorage.getItem('token'));

  try {
    const response = await fetch(
      `http://localhost:3000/posts/${postId}/comments`,
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentPayload),
      },
    );
    if (response.status === 400) {
      const errors = await response.json();
      throw errors;
    }

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

export default commentFetch;
