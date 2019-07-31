import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Article's category
 *
 * @class
 *
 * @extends Model
 *
 */
export default class ArticleCategories extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    articleId: Sequelize.UUID,
    categoryId: Sequelize.UUID
  }

  /**
   * initializes the model
   *
   * @static
   * @memberof ArticleCategories
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the model
   */
  static init(sequelize) {
    const model = super.init(ArticleCategories.modelFields, { sequelize });

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
    ArticleCategories.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    ArticleCategories.belongsTo(models.Categories, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
  }
}
