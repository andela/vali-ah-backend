
/**
  * A wrapper for express js controller for error handling
  *
  * @function
  *
  * @param {Function} wrappedFunction - the main controller
  *
  * @return {Function} - callback that execute the controller
  */
export default wrappedFunction => async (request, response, next) => {
  try {
    await wrappedFunction(request, response, next);
  } catch (error) {
    return next(error);
  }
};
