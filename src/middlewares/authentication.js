import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

import database from '../models';
import { ApplicationError, NotFoundError } from '../helpers/errors';

const { SECRET_KEY } = process.env;
const {
  BlacklistedTokens, Articles, InlineComments, Users
} = database;

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

    jwt.verify(token, SECRET_KEY, async (error, decodedToken) => {
      if (error) return next(new ApplicationError(401, `${error.message}`));

      const { id: userId } = decodedToken;
      const user = await Users.findByPk(userId);

      if (!user) return next(new ApplicationError(403, 'Invalid credentials'));

      request.user = user;

      return next();
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

    const articleResponse = await Articles.findOneArticle(slug);
    request.articleInstance = articleResponse;

    if (!articleResponse) throw new ApplicationError(404, 'Article not found');
    if (articleResponse.authorId !== id) throw new ApplicationError(403, 'Unauthorized Access. For author only');

    next();
  },

  ownComment: async (request, response, next) => {
    const { commentId } = request.params;
    const { id: userId } = request.user;

    const comment = await InlineComments.findByPk(commentId);

    if (!comment) throw new NotFoundError('Comment does not exist');

    if (comment.userId !== userId) next(new ApplicationError(403, 'You are not authorized'));

    request.comment = comment;

    return next();
  }
};
