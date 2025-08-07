// Route not found
const routeNotFound = async (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found',
  });
};

export default routeNotFound;
