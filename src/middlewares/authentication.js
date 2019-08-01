import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

import database from '../models';
import { ApplicationError } from '../helpers/errors';

const { SECRET_KEY } = process.env;
const { BlacklistedTokens } = database;

config();

export default {
  /**
   * Verify Token
   *
   * @param {Object} request - the request object
   *
   * @return {void} - undefined
   */
  verifyToken: async (request) => {
    const authHeader = request.headers.authorization;

    if (authHeader === '') throw new ApplicationError(400, 'No token provided. Please signup or login');

    if (!authHeader) throw new ApplicationError(412, 'Authorization header not set');

    const token = authHeader.split(' ')[1];
    const blacklistedToken = await BlacklistedTokens.findOne({
      where: { token },
    });

    if (blacklistedToken) throw new ApplicationError(403, 'Please login or signup to access this resource');

    jwt.verify(token, SECRET_KEY, (error, decodedToken) => {
      if (error) throw new ApplicationError(401, `${error.message}`);
      request.user = decodedToken;
      return {};
    });
  },

  /**
   * Checks if a user is an admin
   *
   * @param {Object} request - the request object to the server
   *
   * @return {Object} - response object
   */
  isAdmin: (request) => {
    const { isAdmin } = request.user;
    if (!isAdmin) throw new ApplicationError(403, 'Unauthorized Access. For admins accounts only');
  }
};
