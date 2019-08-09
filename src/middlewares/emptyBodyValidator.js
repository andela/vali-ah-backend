/**
 * Generic empty body
 * @function
 *
 * @param {Object} request express request object
 * @param {Object} response  express response object
 * @param {Function} next  express next function
 *
 * @return {Void} undefined
 */
export default (request, response, next) => {
  const { body } = request;

  if (Object.keys(body).length === 0) {
    return response.status(400).json({ status: 'error', message: 'Body can not be empty' });
  }

  return next();
};
