
/**
  * A wrapper for express js controller for error handling
  *
  * @function
  *
  * @param {Function} wrappedFunction - the main controller
  * @param {Boolean} middleware - A flag to know if it is a middleware
  *
  * @returns {Function} - callback that execute the controller
  */
export default wrappedFunction => async (request, response, next) => {
  try {
    await wrappedFunction(request, response, next);
  } catch (error) {
    return next(error);
  }
};
