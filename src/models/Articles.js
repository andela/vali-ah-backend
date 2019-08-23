import { Sequelize, Model } from 'sequelize';

import { NotFoundError } from '../helpers/errors';
import Similarity from '../helpers/cosine';

/**
 * Model class for Articles
 *
 * @class
 *
 * @extends Model
 * @exports Articles
 */
export default class Articles extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    title: Sequelize.STRING,
    summary: Sequelize.STRING,
    body: Sequelize.TEXT,
    suspended: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    coverImageUrl: Sequelize.STRING,
    followUpId: Sequelize.UUID,
    authorId: Sequelize.UUID,
    slug: Sequelize.STRING
  }

  static indexSlob = 30;

  /**
   * Initializes the Articles model
   *
   * @static
   * @memberof Articles
   *
   * @param {any} sequelize the sequelize object
   *
   * @returns {Object} the Articles model
   */
  static init(sequelize) {
    const model = super.init(Articles.modelFields, { sequelize });

    model.afterUpdate(Articles.normalizeInlineComments);
    model.afterBulkUpdate(Articles.normalizeInlineComments);

    return model;
  }

  /**
   *  Model associations
   *
   * @static
   * @memberof Articles
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    this.belongsTo(models.Users, {
      foreignKey: 'authorId',
      as: 'author',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.Bookmarks, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.Reports, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.Votes, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.Comments, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.InlineComments, {
      foreignKey: 'articleId',
      as: 'inlineComments',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.ArticleCategories, {
      foreignKey: 'articleId',
      as: 'category',
      onDelete: 'CASCADE'
    });

    this.belongsToMany(models.Categories, {
      as: 'categories',
      through: 'ArticleCategories',
      foreignKey: 'articleId',
      otherKey: 'categoryId',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.ReadStats, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.Articles, {
      foreignKey: 'followUpId',
      as: 'followUp',
      onDelete: 'CASCADE'
    });
  }

  /**
   * Create article comment
   *
   * @static
   * @memberof Articles
   *
   * @param {Object} data
   * @param {String} data.articleId - id of the article to comment on
   * @param {String} data.comment - comment contents
   *
   * @returns {Object | void} - details of comment data
   */
  static async createComment({ articleId, comment }) {
    const articleObject = await this.findByPk(articleId);

    if (!articleObject) throw new NotFoundError();

    return articleObject.createComment(comment);
  }

  /**
   * Get details for a single article
   *
   * @static
   * @memberof Articles
   *
   * @param {string} articleId
   *
   * @returns {Object} article's data
   */
  static async getSingleArticle(articleId) {
    const articleData = await this.findByPk(articleId, {
      include: [
        {
          model: this.models.Users,
          as: 'author',
          include: [{ model: this.models.Sessions, as: 'session' }]
        }
      ]
    });

    if (!articleData) throw new NotFoundError();

    return articleData.toJSON();
  }

  /**
   * Get existing article
   *
   * @static
   * @memberof Articles
   *
   * @param {string} articleId
   *
   * @returns {Object | void} - details of existing article
   */
  static async getExistingArticle(articleId) {
    const article = await this.findByPk(articleId);

    if (!article) throw new NotFoundError();

    return article;
  }

  /**
   * function to check if an article has been suspended
   *
   * @method
   * @memberof Articles
   *
   * @return {boolean} return true of false
   */
  async suspendArticle() {
    const upVotes = await this.countVotes({ where: { upVote: true } });
    const downVotes = await this.countVotes({ where: { upVote: false } });

    if (downVotes - upVotes >= 5) {
      await this.update({ suspended: true }, { returning: true });
      return true;
    }
    return false;
  }

  /** Gets all articles
   *
   * @static
   * @memberof Articles
   *
   * @param {string} queryString - string to sort
   * @param {string} column - database column to search in
   *
   * @returns {Array} - array or undefined
   */
  static async getArticles(queryString, column = 'title') {
    const article = await Articles.findAll({
      where: {
        [column]: { [Sequelize.Op.iLike]: queryString }
      }
    });
    return article;
  }

  /**
   * Delete an article by slug
   *
   * @static
   * @memberof Articles
   *
   * @param {string} slug - title of the article to be sort
   *
   * @returns {void} - return nothing
   */
  static async deleteArticle(slug) {
    await Articles.destroy({
      returning: true,
      where: {
        slug: { [Sequelize.Op.iLike]: slug }
      }
    });
  }

  /**
   * Gets the inline comments of an article
   *
   * @static
   * @memberof Articles
   *
   * @param {string} articleId - id of article
   *
   * @returns {void} - return nothing
   */
  static async getInlineComments(articleId) {
    const article = await this.findByPk(articleId);

    if (!article) throw new NotFoundError(`Article with id ${articleId} doesnt exist`);

    const inlineComments = await article
      .getInlineComments({ include: [{ model: this.models.Users, attributes: ['id', 'firstName', 'lastName', 'userName', 'avatarUrl'] }] });

    return JSON.parse(JSON.stringify(inlineComments));
  }

  /**
   * Create inline comment for an article
   *
   * @static
   * @memberof Articles
   *
   * @param {string} articleId - id of article to comment on
   * @param {Object} comment - body of comment
   *
   * @returns {void} - return nothing
   */
  static async createInlineComment(articleId, comment) {
    const article = await this.findByPk(articleId);

    if (!article) throw new NotFoundError(`Article with id ${articleId} not found`);

    const commentData = await this.getInlineCommentData(article.id, comment);

    return article.createInlineComment(commentData);
  }

  /**
   * update inline comment for an article
   *
   * @static
   * @memberof Articles
   *
   * @param {Object} comment - object of comment
   * @param {Object} commentData - data to update
   *
   * @returns {void} - return nothing
   */
  static async updateInlineComment(comment, commentData) {
    const updateData = await this
      .getInlineCommentData(comment.articleId, { ...comment, ...commentData });

    return comment.update(updateData);
  }

  /**
   * Create inline comment for an article
   *
   * @static
   * @memberof Articles
   *
   * @param {string} articleId - id of article to comment on
   * @param {Object} comment - body of comment
   *
   * @returns {void} - return nothing
   */
  static async getInlineCommentData(articleId, comment) {
    const article = await this.findByPk(articleId);

    if (!article) throw new NotFoundError(`Article with id ${articleId} not found`);

    const { startIndex, endIndex } = comment;

    const startIndexWithSlob = startIndex - this.indexSlob < 0 ? 0 : startIndex - this.indexSlob;

    const highlightedText = article.body.substring(startIndex, endIndex);
    let context = article.body.substring(startIndexWithSlob, endIndex + this.indexSlob);

    const contextStartIndex = context.indexOf(' ') < 0 ? 0 : context.indexOf(' ');
    const contextEndIndex = context.lastIndexOf(' ');

    const highlightIndex = `${comment.startIndex}:${comment.endIndex}`;
    const contextIndex = `${contextStartIndex}:${contextEndIndex}`;

    context = context.slice(contextStartIndex, contextEndIndex);

    return {
      ...comment, highlightIndex, contextIndex, context, highlightedText, articleId
    };
  }

  /**
   * marks an inline comment invalid if highligted text no longer exist
   *
   * @function
   *
   * @param {Object} articleData
   *
   * @returns {void} - return nothing
   */
  static async normalizeInlineComments(articleData) {
    const searchCondition = articleData.where;
    const article = await this.findOne({ where: searchCondition });
    const comments = await article.getInlineComments();

    const normalizedComments = comments.map(async (comment) => {
      const normalized = article.normalizeSingleInlineComment(comment);
      await comment.update({ valid: normalized });
    });

    return Promise.all(normalizedComments);
  }

  /**
   * Scores an inline comment based on the validity of the context
   *
   * @function
   *
   * @param {Object} comment
   *
   * @returns {void} - return nothing
   */
  normalizeSingleInlineComment(comment) {
    const [contextStartIndex, contextEndIndex] = comment.contextIndex.split(':');
    const { body } = this;
    const contextInArticle = body.substring(contextStartIndex, contextEndIndex);
    const { context: contextInComment } = comment;

    const similarity = Similarity(contextInArticle, contextInComment);

    return similarity >= 0.6;
  }

  /** Get one article by slug
   *
   * @static
   * @memberof Articles
   *
   * @param {string} slug - slug of the article to be gotten
   * @param {Object} options - optional object for database query option
   *
   * @returns {Array} - array
   */
  static async findOneArticle(slug, options = {}) {
    const article = await Articles.findOne({
      where: {
        slug: { [Sequelize.Op.iLike]: slug }, ...options
      }
    });
    return article;
  }

  /** Update article
   *
   * @static
   * @memberof Articles
   *
   * @param {Object} articleInstance - an instance of the article's model
   * @param {Object} article - article object
   *
   * @returns {Array} - array
   */
  static async updateArticle(articleInstance, article) {
    article = await articleInstance.update(article, {
      returning: true
    });
    return article;
  }
}
