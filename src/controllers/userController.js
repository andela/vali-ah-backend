import * as userService from '../services/userAuth';


/**
 * Handles user signup.
 *
 * @param {Object} request - The requst object.
 * @param {Object} response - The server response object
 * @param {Function} next - To call the express error handler
 *
 * @return {Void} - Sends information to the server
 */
export const signup = async (request, response, next) => {
  try {
    await userService.createUser(request, response, next);
  } catch (error) {
    const err = new Error();
    err.message = error.message;
    err.status = 500;
    next(err);
  }
};


/**
 * Handles user signin
 *
 * @param {Object} request - The request object to the server
 * @param {Object} response - The response object from the server
 * @param {Function} next - Calls the express error handler
 *
 * @return {Void} - Sends information to the server
 */
export const signin = async (request, response, next) => {
  try {
    await userService.checkinUser(request, response, next);
  } catch (error) {
    const err = new Error();
    err.message = error.message;
    err.status = 500;
    next(err);
  }
};
