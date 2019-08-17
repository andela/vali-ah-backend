import slugify from 'slugify';

import Models from '../models';
import paginator from '../helpers/paginator';
import { ApplicationError, NotFoundError } from '../helpers/errors';
import notification from '../services/notification';
import * as helpers from '../helpers';
import { getTagName } from '../helpers/article';

const { filter, extractArticles } = helpers;
const {
  Articles,
  Users,
  ArticleCategories,
  ReadStats,
  Votes,
  Reports,
  Comments,
  Bookmarks,
} = Models;

export default {
  /**
    * controller for creating comments
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @returns {Object} - the response from the server
    */
  createComment: async (request, response) => {
    const { articleId } = request.params;
    const { id: userId } = request.user;

    const comment = { ...request.body, userId };

    const articleData = await Articles.createComment({ articleId, comment });

    return response
      .status(201)
      .json({ status: 'success', data: articleData, message: 'Comment added succesfully' });
  },

  /**
   * controller for adding article to bookmark
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - the created bookmark
   */
  createBookmark: async (request, response) => {
    const { articleId } = request.params;
    const { id: userId } = request.user;

    const articleObject = await Articles.getExistingArticle(articleId);

    const existingBookmark = await Bookmarks.getExistingBookmark(articleId, userId);

    if (existingBookmark) throw new ApplicationError(409, 'Bookmark already added');

    const newBookmark = await articleObject.createBookmark({ userId });

    return response
      .status(201)
      .json({ status: 'success', data: newBookmark, message: 'Bookmark added succesfully' });
  },

  /**
   * controller for removing articles from bookmarks
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {string} - article removed success message
   */
  removeBookmark: async (request, response) => {
    const { articleId } = request.params;
    const { id: userId } = request.user;

    const existingBookmark = await Bookmarks.getExistingBookmark(articleId, userId);

    if (!existingBookmark) throw new NotFoundError();

    await Bookmarks.destroy({ where: { articleId, userId } });

    return response
      .status(200)
      .json({ status: 'success', message: 'Article removed from bookmark' });
  },

  /**
   * controller for searching for articles
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - callback that execute the controller
   */
  searchArticle: async (request, response) => {
    const {
      author, title, tag, keyword, page = 1, limit = 10
    } = request.query;

    const queriesValues = title || tag || author || keyword;
    const standardQueries = title || author || tag;
    const queryFilter = filter(title, tag, author, keyword);

    const { data: results, count, currentCount } = await paginator(ArticleCategories, {
      ...queryFilter,
      raw: true,
      page,
      limit
    });

    if (keyword && standardQueries) {
      return response
        .status(400)
        .json({ status: 'error', message: 'Keyword cannot be used with title, author or tag' });
    }
    if (!currentCount) return response.status(404).json({ status: 'error', message: `${queriesValues} Not found` });

    const result = extractArticles(results);

    return response.status(200).json({
      status: 'success',
      data: {
        count,
        page,
        current: +page,
        result
      },
      message: 'Articles retrieved successfully'
    });
  },

  /**
   * controller for up voting and down voting articles
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - callback that execute the controller
   */
  voteArticle: async (request, response) => {
    const { voteType } = request.body;
    const { articleId } = request.params;
    const { id: userId } = request.user;

    let responseData = {};
    let created;

    const article = await Articles.findOne({ where: { id: articleId, suspended: false } });

    if (!article) throw new ApplicationError(400, 'This article does not exist or has been suspended');

    if (voteType === 'nullVote') {
      await Votes.destroy({ where: { userId, articleId } });

      responseData = { data: {}, message: 'Vote successfully removed' };
    } else {
      let data;
      const upVote = voteType === 'upVote';
      ({ created, data } = await Votes.upsertVote({ articleId, userId, upVote }));

      notification.emit('articleVoted', { articleId, userId, upVote });

      responseData = {
        data,
        message: `Article successfully ${upVote ? 'upvoted' : 'downvoted'}`
      };
    }

    const suspended = await article.suspendArticle();

    if (suspended) notification.emit('articleSuspended', { articleId });

    const status = created ? 201 : 200;

    return response.status(status).json({
      status: 'success',
      ...responseData
    });
  },

  /**
    * controller for getting comments
    *
    * @function
    *
    * @param {request} request - express request object
    * @param {response} response - express response object
    *
    * @returns {Object} - the response from the server
    */
  getComments: async (request, response) => {
    const { articleId } = request.params;

    const existingArticleId = await Articles.findByPk(articleId);

    if (!existingArticleId) throw new ApplicationError(404, 'Non-existing articleId');

    const comments = await Comments.findAll({
      where: { articleId }
    });

    const message = comments.length ? `Comment${comments.length > 1 ? 's' : ''} retrieved successfully`
      : 'There is no comment for this article';

    return response.status(200).json({ status: 'success', data: comments, message });
  },

  /** controller for creating articles
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @returns {Object} - callback that execute the controller
    */
  createArticle: async (request, response) => {
    const { tag } = request.body;

    const article = {
      ...request.body,
      authorId: request.user.id,
      coverImageUrl: (request.file) ? request.file.secure_url : null,
      slug: slugify(request.body.title)
    };

    const titlePresent = await Articles.getArticles(request.body.title);

    if (titlePresent.length) article.slug = slugify(`${request.body.title} ${titlePresent.length}`);

    const articleResponse = await Articles.create(article);
    const tagResponse = (tag) ? await ArticleCategories.createTags(
      tag, articleResponse.id, request.user.id
    ) : [];
    const tagName = await getTagName(tagResponse);

    return response.status(201).json({ status: 'success', data: { ...articleResponse.dataValues, Tags: tagName }, message: 'Article successfully created' });
  },

  /**
    * controller for getting articles by slug
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @returns {Object} - callback that execute the controller
    */
  getBySlug: async (request, response) => {
    const { slug } = request.params;

    let articleResponse = await Articles.findOne({
      where: {
        slug
      },
      include: [{
        model: ArticleCategories,
        as: 'category'
      },
      {
        model: Users,
        as: 'authors'
      },
      {
        model: ReadStats
      },
      {
        model: Votes
      }, {
        model: Reports
      },
      {
        model: Comments
      }],
    });

    if (!articleResponse) throw new ApplicationError(404, 'Article not found');
    const { dataValues } = articleResponse;
    const tags = dataValues.category.map(eachTag => eachTag.categoryId);

    let voteCount = 0;
    articleResponse.dataValues.Votes.forEach((vote) => {
      voteCount = (vote.upVote) ? voteCount += 1 : voteCount -= 1;
    });

    const tagName = await getTagName(tags);
    const { password, ...author } = articleResponse.dataValues.authors.dataValues;
    const { category, authors, ...newArticleResponse } = articleResponse.dataValues;

    articleResponse = {
      ...newArticleResponse,
      Tags: tagName,
      Votes: voteCount,
      Author: author
    };

    return response.status(200).json({ status: 'success', data: articleResponse, message: 'Article successfully returned' });
  },

  /**
    * controller to update article by slug
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @returns {Object} - callback that execute the controller
    */
  updateArticle: async (request, response) => {
    const { slug } = request.params;
    const { tag } = request.body;
    const {
      articleId,
      authorId,
      slug: invalidSlug,
      ...article
    } = request.body;

    if (request.file) article.coverImageUrl = request.file.secure_url;

    const articleResponse = await Articles.update(article,
      {
        returning: true,
        where: { slug }
      });

    let tagName = [];
    if (tag) {
      await ArticleCategories.deleteTags(articleResponse[1][0].id);
      const tagResponse = await ArticleCategories.createTags(
        tag, articleResponse[1][0].id, request.user.id
      );
      tagName = await getTagName(tagResponse);
    }

    return response.status(200).json({ status: 'success', data: { ...articleResponse[1][0].dataValues, Tags: tagName }, message: 'Article succesfully updated' });
  },

  /**
    * controller for deleting articles by slug
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @returns {Object} - callback that execute the controller
    */
  deleteArticle: async (request, response) => {
    const { slug } = request.params;
    await Articles.deleteArticle(slug);
    return response.status(200).json({ status: 'success', data: {}, message: 'Article deleted succesfully' });
  }
};
