import { Sequelize, Model } from 'sequelize';

import { NotFoundError } from '../helpers/errors';

/**
 * Model class for Articles
 *
 * @class
 *
 * @extends Model
 *
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
    authorId: Sequelize.UUID
  }

  /**
   * initializes the model
   *
   * @static
   * @memberof Articles
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the model
   */
  static init(sequelize) {
    const model = super.init(Articles.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof ArticleCategories
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
   */
  static associate(models) {
    Articles.belongsTo(models.Users, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Bookmarks, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Reports, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Votes, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Comments, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.ArticleCategories, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.ReadStats, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Articles, {
      foreignKey: 'followUpId',
      onDelete: 'CASCADE'
    });
  }

  /**
   * model association
   *
   * @static
   * @memberof Articles
   *
   * @param {Object} data - The event payload. Contains notification type and payload.
   * @param {String} data.article - article to comment on
   * @param {String} data.comment - comment data
   *
   * @return {Object | void} - details of comment data
   */
  static async createComment({ article, comment }) {
    const articleObject = await this.findByPk(article);

    if (articleObject) return articleObject.createComment(comment);

    throw new NotFoundError();
  }
}
