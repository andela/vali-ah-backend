import Models from '../models';
import paginator from '../helpers/paginator';
import { NotFoundError, ApplicationError } from '../helpers/errors';

const { Bookmarks, Articles, } = Models;

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
   * controller for searching for articles
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
  },

  /**
   * controller for adding article to bookmark
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @return {Object} - the created bookmark
   */
  createBookmark: async (request, response) => {
    const { articleId } = request.params;
    const { id: userId } = request.user;

    const articleObject = await Articles.getExistingArticle(articleId);

    const existingBookmark = await Bookmarks.getExistingBookmark(articleId, userId);

    if (existingBookmark) throw new ApplicationError(409, 'Bookmark already added');

    const newBookmark = await articleObject.createBookmark({ userId });

    return response.status(201).json({ status: 'success', data: newBookmark, message: 'Bookmark added succesfully' });
  },

  /**
   * controller for removing articles from bookmarks
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @return {string} - article removed success message
   */
  removeBookmark: async (request, response) => {
    const { articleId } = request.params;
    const { id: userId } = request.user;

    const existingBookmark = await Bookmarks.getExistingBookmark(articleId, userId);

    if (!existingBookmark) throw new NotFoundError();

    await Bookmarks.destroy({ where: { articleId, userId } });

    return response.status(200).json({ status: 'success', message: 'Article removed from bookmark' });
  }
};
