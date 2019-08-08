import Models from '../models';
import paginator from '../helpers/paginator';

const { Articles } = Models;

export default {
  /**
    * controller for creating comments
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @return {Object} - callback that execute the controller
    */
  createComment: async (request, response) => {
    const { articleId } = request.params;
    const { id: userId } = request.user;

    const comment = { ...request.body, userId };

    const articleData = await Articles.createComment({ articleId, comment });

    return response.status(201).json({ status: 'success', data: articleData, message: 'Comment added succesfully' });
  },

  /**
   * controller for search article
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @return {Object} - callback that execute the controller
   */
  searchArticles: async (request, response) => {
    const { page = 1, limit = 10 } = request.query;
    const { data: articles, count } = await paginator(Articles, { page, limit });

    return response.status(200).json({
      status: 'success',
      data: {
        count, page, current: +page, articles
      },
      message: 'Articles retrieved successfully'
    });
  }
};
