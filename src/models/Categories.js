import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Categories
 *
 * @class
 *
 * @extends Model
 *
 */
export default class Categories extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    category: Sequelize.STRING,
    description: Sequelize.STRING
  }

  /**
   * initializes the User model
   *
   * @static
   * @memberof Categories
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Categories model
   */
  static init(sequelize) {
    const model = super.init(Categories.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof Categories
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
   */
  static associate(models) {
    Categories.hasMany(models.ArticleCategories, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
  }
}
