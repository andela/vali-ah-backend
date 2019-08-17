import Debug from 'debug';
import { config } from 'dotenv';

config();
const debug = Debug('dev');

/**
  * A wrapper for express js controller for error handling
  *
  * @function
  *
  * @param {Object} err - error object
  * @param {Object} request - express request object
  * @param {Object} response - express response object
  * @param {Function} next - callback function to call next middleware
  *
  * @returns {object} - the response from the server
  */
export default (err, request, response, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  let errorMessage = {};

  if (response.headersSent) {
    return next(err);
  }

  if (!isProduction) {
    debug(err.stack);
    errorMessage = err;
  }

  return response.status(err.status || 500).json({
    status: 'error',
    error: {
      ...(err.errors && { errors: err.errors }),
      message: err.message,
      ...(!isProduction && { trace: errorMessage })
    }
  });
};
