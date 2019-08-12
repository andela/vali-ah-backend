import { idPresent, checkTags } from '../helpers/article';
import { ApplicationError } from '../helpers/errors';
import Models from '../models';

const {
  Articles,
  Users,
} = Models;

export default {

  /**
 * function to validate article inputs
 *
 * @function
 *
 * @param {Object} request - express request object
 * @param {Object} response - express response object
 * @param {Function} next - callback function to call next middleware
 *
 * @returns {void} - it just validates and calls next
 */
  checkArticle: async (request, response, next) => {
    const { followUpId, tag } = request.body;
    const authorId = request.user.id;
    const followupIdPresent = (followUpId) ? await idPresent(followUpId, Articles) : true;
    const authorIdIdPresent = await idPresent(authorId, Users);

    if (!followupIdPresent || !authorIdIdPresent) {
      const message = (followupIdPresent) ? 'Invalid author Id' : 'Invalid followup id';
      throw new ApplicationError(404, message);
    }
    await checkTags(tag);
    next();
  },

  /**
 * function to validate article inputs on update
 *
 * @function
 *
 * @param {Object} request - express request object
 * @param {Object} response - express response object
 * @param {Function} next - callback function to call next middleware
 *
 * @returns {void} - it just validates and calls next
 */
  checkArticleUpdate: async (request, response, next) => {
    const { followUpId, tag } = request.body;

    const followupIdPresent = (followUpId) ? await idPresent(followUpId, Articles) : true;

    if (!followupIdPresent) {
      throw new ApplicationError(404, 'Invalid followup id');
    }
    await checkTags(tag);
    next();
  }
};
