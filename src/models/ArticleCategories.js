import { Sequelize, Model } from 'sequelize';

/**
 * Model class for ArticleCategories
 *
 * @class
 *
 * @extends Model
 * @exports ArticleCategories
 */
export default class ArticleCategories extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    articleId: Sequelize.UUID,
    categoryId: Sequelize.UUID,
    authorId: Sequelize.UUID

  }

  /**
   * Initializes the ArticleCategories model
   *
   * @static
   * @memberof ArticleCategories
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the ArticleCategories model
   */
  static init(sequelize) {
    const model = super.init(ArticleCategories.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof ArticleCategories
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    ArticleCategories.belongsTo(models.Articles, {
      as: 'article',
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    ArticleCategories.belongsTo(models.Categories, {
      as: 'tag',
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
    ArticleCategories.belongsTo(models.Users, {
      foreignKey: 'authorId',
      as: 'author',
      onDelete: 'CASCADE'
    });
  }
}
