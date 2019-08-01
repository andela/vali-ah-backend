
/**
  * A wrapper for express js controller for error handling
  *
  * @function
  *
  * @param {Function} wrappedFunction - the main controller
  * @param {Boolean} middleware - A flag to know if it is a middleware
  *
  * @return {Function} - callback that execute the controller
  */
export default (wrappedFunction, middleware = false) => async (request, response, next) => {
  try {
    const { status, data, message } = await wrappedFunction(request, response, next) || {};

    if (middleware) return next();

    return response.status(status).json({ status: 'success', data, message });
  } catch (error) {
    return next(error);
  }
};
