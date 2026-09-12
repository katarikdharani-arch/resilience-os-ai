function success(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    ...data
  });
}
function error(res, message, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}
function cleanObject(object) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );
}
module.exports = {
  success,
  error,
  cleanObject
};
