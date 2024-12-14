const apiDomain = () => {
  const production = import.meta.env.PROD;

  return production
    ? 'https://odin-book-787i.onrender.com'
    : 'http://localhost:5173';
};

export default apiDomain;
