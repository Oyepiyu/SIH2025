export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};
