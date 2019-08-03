
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
    const { status, data, message } = await wrappedFunction(request, response, next);

    return response.status(status).json({ status: 'success', data, message });
  } catch (error) {
    return next(error);
  }
};
