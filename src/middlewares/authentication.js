import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

import database from '../models';
import { ApplicationError } from '../helpers/errors';

const { SECRET_KEY } = process.env;
const { BlacklistedTokens, Articles } = database;

config();

export default {
  /**
   * Verify Token
   *
   * @param {Object} request - the request object
   * @param {Object} response - express response object
   * @param {Function} next
   *
   * @returns {void} - undefined
   */
  verifyToken: async (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (authHeader === '') throw new ApplicationError(400, 'No token provided. Please signup or login');

    if (!authHeader) throw new ApplicationError(412, 'Authorization header not set');

    const token = authHeader.split(' ')[1];
    const blacklistedToken = await BlacklistedTokens.findOne({
      where: { token }
    });

    if (blacklistedToken) throw new ApplicationError(403, 'Please login or signup to access this resource');

    jwt.verify(token, SECRET_KEY, (error, decodedToken) => {
      if (error) throw new ApplicationError(401, `${error.message}`);
      request.user = decodedToken;

      next();
    });
  },

  /**
   * Checks if a user is an admin
   *
   * @param {Object} request - the request object to the server
   * @param {Object} response - express response object
   * @param {Function} next
   *
   * @returns {Object} - response object
   */
  isAdmin: (request, response, next) => {
    const { isAdmin } = request.user;
    if (!isAdmin) throw new ApplicationError(403, 'Unauthorized Access. For admins accounts only');

    next();
  },

  /**
   * Checks if user is the author of the article
   *
   * @param {Object} request - the request object to the server
   * @param {Object} response - express response object
   * @param {Function} next
   *
   * @returns {void} - passes control to the next middleware
   */
  isAuthor: async (request, response, next) => {
    const { id } = request.user;
    const { slug } = request.params;

    const articleResponse = await Articles.findOne({
      where: { slug }
    });

    if (!articleResponse) throw new ApplicationError(404, 'Article not found');
    const article = await Articles.findOne({
      where: { authorId: id, slug }
    });

    if (!article) throw new ApplicationError(403, 'Unauthorized Access. For author only');
    next();
  }
};
