import uuid from 'uuid/v4';
import { Sequelize } from 'sequelize';

import Models from '../models';
import paginator from '../helpers/paginator';
import { ApplicationError, NotFoundError } from '../helpers/errors';
import notification from '../services/notification';
import * as helpers from '../helpers';
import { getTagName } from '../helpers/article';
import slugify from '../helpers/slugify';

const { filter, extractArticles } = helpers;
const {
  Articles,
  Users,
  ArticleCategories,
  ReadStats,
  Votes,
  Reports,
  Comments,
  Followers,
  Bookmarks,
  InlineComments,
  Categories
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

    const existingBookmark = await Bookmarks.getExistingBookmark(
      articleId,
      userId
    );

    if (existingBookmark) { throw new ApplicationError(409, 'Bookmark already added'); }

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

    const existingBookmark = await Bookmarks.getExistingBookmark(
      articleId,
      userId
    );

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
   * @param {Function} next
   *
   * @returns {Object} - callback that execute the controller
   */
  searchArticle: async (request, response, next) => {
    let data = [];
    const {
      author, title, tag, keyword, includeSubscriptions, page = 1, limit = 10
    } = request.query;

    const standardQueries = title || author || tag;
    const queryFilter = filter(title, tag, author, keyword);

    if (includeSubscriptions) {
      return next();
    }

    if (keyword && standardQueries) {
      throw new ApplicationError(400, 'Keyword cannot be used with title, author or tag');
    }

    const { data: results, count } = await paginator(ArticleCategories, {
      ...queryFilter,
      raw: true,
      page,
      limit
    });

    if (count) {
      data = extractArticles(results);
    }

    return response.status(200).json({
      status: 'success',
      data,
      count,
      page: +page,
      limit: +limit,
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

    if (!article) throw new ApplicationError(404, 'Article does not exist or has been suspended');

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
      id: uuid(),
      authorId: request.user.id,
      coverImageUrl: (request.file) ? request.file.secure_url : null,
    };

    if (!article.summary) article.summary = article.body.substring(0, 20);
    article.slug = slugify(`${request.body.title} ${article.id}`);

    const articleResponse = await Articles.create(article);

    const tagResponse = (tag) ? await ArticleCategories.createTags(
      tag, articleResponse.id, request.user.id
    ) : [];
    const tagName = await getTagName(tagResponse);

    return response.status(201).json({ status: 'success', data: { ...articleResponse.dataValues, tags: tagName }, message: 'Article successfully created' });
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
        slug: { [Sequelize.Op.iLike]: slug }
      },
      include: [{
        model: ArticleCategories,
        as: 'category'
      },
      {
        model: Users,
        as: 'author'
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
    const { category, author: articleAuthor, ...newArticleResponse } = articleResponse.dataValues;
    const { password, ...author } = articleAuthor.dataValues;

    articleResponse = {
      ...newArticleResponse,
      tags: tagName,
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
    const { tag } = request.body;
    const {
      articleId,
      authorId,
      slug,
      id,
      ...article
    } = request.body;

    if (request.file) article.coverImageUrl = request.file.secure_url;

    const articleResponse = await Articles.updateArticle(request.articleInstance, article);
    let tagName = [];

    if (tag) {
      await ArticleCategories.deleteTags(articleResponse.id);
      const tagResponse = await ArticleCategories.createTags(
        tag, articleResponse.id, request.user.id
      );
      tagName = await getTagName(tagResponse);
    } else {
      const val = await ArticleCategories.findTags(articleResponse.id);
      const createdTags = val.map(eachTag => eachTag.dataValues.categoryId);
      tagName = await getTagName(createdTags);
    }

    return response.status(200).json({ status: 'success', data: { ...articleResponse.dataValues, tags: tagName }, message: 'Article succesfully updated' });
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

    return response.status(200).json({ status: 'success', message: 'Article deleted succesfully' });
  },

  /**
  * controller for creating inline comments for an article
  *
  * @function
  *
  * @param {Object} request - express request object
  * @param {Object} response - express response object
  *
  * @return {Object} - callback that execute the controller
  */
  createInlineComment: async (request, response) => {
    const { articleId } = request.params;
    const commentData = { ...request.body, userId: request.user.id };

    const comment = (await Articles.createInlineComment(articleId, commentData)).toJSON();

    return response.status(201).json({ status: 'success', data: comment, message: 'Inline comment added succesfully' });
  },

  /**
  * controller for updating inline comments for an article
  *
  * @function
  *
  * @param {Object} request - express request object
  * @param {Object} response - express response object
  *
  * @return {Object} - callback that execute the controller
  */
  updateInlineComment: async (request, response) => {
    const { articleId, userId: userIdInBody, ...commentData } = request.body;
    const { comment } = request;

    const updatedComment = (await Articles.updateInlineComment(comment, commentData)).toJSON();

    return response.status(200).json({ status: 'success', data: updatedComment, message: 'Inline comment updated succesfully' });
  },

  /**
    * controller for deleting inline comments for an article
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @return {Object} - callback that execute the controller
    */
  deleteInlineComment: async (request, response) => {
    const { comment } = request;

    await comment.destroy();

    return response.status(200).json({ status: 'success', data: { }, message: 'Inline comment deleted succesfully' });
  },

  /**
    * controller for getting an inline comment
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @return {Object} - callback that execute the controller
    */
  getInlineComment: async (request, response) => {
    const { commentId } = request.params;

    const comment = await InlineComments.findByPk(commentId, { include: [{ model: Users, attributes: ['id', 'firstName', 'lastName', 'userName', 'avatarUrl'] }] });

    if (!comment) throw new NotFoundError('Comment does not exist');

    const commentData = comment.toJSON();

    return response.status(200).json({ status: 'success', data: commentData, message: 'Inline comment retrieved succesfully' });
  },

  /**
    * controller for getting inline comments for an article
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @return {Object} - callback that execute the controller
    */
  getArticleInlineComment: async (request, response) => {
    const { articleId } = request.params;

    const comments = await Articles.getInlineComments(articleId);

    return response.status(200).json({ status: 'success', data: comments, message: 'Inline comment retrieved succesfully' });
  },

  /**
    * controller for fetching articles followed by user
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @return {Object} - callback that execute the controller
    */
  getUserFeed: async (request, response) => {
    const { id: userId } = request.user;
    const { page = 1, limit = 10 } = request.query;
    const followedAuthors = await Followers.getAuthors(userId);
    const followedAuthorsId = followedAuthors.map(eachAuthor => eachAuthor.followeeId);
    const { data, count } = await paginator(Articles, {
      where: {
        authorId: followedAuthorsId,
        status: 'published'
      },
      include: [{
        model: Categories,
        as: 'categories'
      },
      {
        model: Users,
        as: 'author'
      }],
      page,
      limit
    });
    const articles = await data.map((eachArticle) => {
      const { author: articleAuthor, categories, ...article } = eachArticle.dataValues;
      const { password, ...author } = articleAuthor.dataValues;
      const tags = categories.map(eachCategory => eachCategory.category);

      return { ...article, tags, author };
    });

    return response.status(200).json({
      status: 'success',
      data: articles,
      count,
      page: +page,
      limit: +limit,
      message: 'Articles fetched succesfully'
    });
  },

  /** controller for getting articles subscribed for.
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @return {Object} - callback that execute the controller
   */
  getSubscribedArticles: async (request, response) => {
    const { id: userId } = request.user;
    const { page = 1, limit = 10 } = request.query;

    const user = await Users.findByPk(userId);
    const categoryIds = (await user.getSubscriptions({ attributes: ['categoryId'] })).map(sub => sub.categoryId);

    const query = {
      limit,
      page,
      include: [{
        model: Users,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName', 'avatarUrl']

      }, {
        model: ArticleCategories,
        as: 'category',
        where: { categoryId: categoryIds },
        attributes: [['categoryId', 'id']],
        include: [{
          model: Categories,
          as: 'tag',
          attributes: ['category']
        }]
      }]
    };

    const { data, count } = await paginator(Articles, query);

    const articles = data.map((article) => {
      const { category, ...articleData } = article.toJSON();

      return {
        ...articleData,
        category: category.map(({ id, tag }) => ({ id, category: tag && tag.category }))
      };
    });

    return response.status(200).json({
      status: 'success',
      data: articles,
      count,
      page: +page,
      limit: +limit,
      message: 'Subscribed articles retrieved successfully'
    });
  },

  /**
   * Controller for getting all bookmarks for a user
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - all bookmark for a user
   */
  getAllBookmark: async (request, response) => {
    const { id: userId, limit = 10, page = 1 } = request.user;

    const { data, count } = await paginator(Bookmarks, { where: { userId }, page, limit });

    return response.status(200).json({
      status: 'success',
      data,
      count,
      page: +page,
      limit: +limit,
      message: 'Bookmarks fetched successfully',
    });
  }
};
