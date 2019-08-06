import { Sequelize, Model } from 'sequelize';

import { NotFoundError } from '../helpers/errors';

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
    authorId: Sequelize.UUID
  }

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
   * Create article comment
   *
   * @static
   * @memberof Articles
   *
   * @param {Object} data
   * @param {String} data.articleId - id of the article to comment on
   * @param {String} data.comment - comment contents
   *
   * @return {Object | void} - details of comment data
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
      include: [{
        model: this.models.Users,
        include: [{ model: this.models.Sessions, as: 'session' }]
      }]
    });

    if (!articleData) throw new NotFoundError();

    return articleData.toJSON();
  }
}
