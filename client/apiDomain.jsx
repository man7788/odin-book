const apiDomain = () => {
  const production = import.meta.env.NODE_ENV === 'production';
  console.log(production);
  return production
    ? 'https://odin-book-787i.onrender.com/'
    : 'http://localhost:5173';
};

export default apiDomain;
