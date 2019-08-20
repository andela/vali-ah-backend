import { Sequelize, Model } from 'sequelize';

/**
 * Model class for ArticleCategories
 *
 * @class
 *
 * @extends Model
 * @exports Subscriptions
 */
export default class Subscriptions extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    categoryId: Sequelize.UUID,
    userId: Sequelize.UUID
  };

  /**
   * Initializes the ArticleCategories model
   *
   * @static
   * @memberof Subscriptions
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the ArticleCategories model
   */
  static init(sequelize) {
    const model = super.init(Subscriptions.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Subscriptions
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    Subscriptions.belongsTo(models.Categories, {
      as: 'category',
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });

    Subscriptions.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'subscriber',
      onDelete: 'CASCADE'
    });
  }
}
