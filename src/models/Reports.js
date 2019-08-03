import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Reports
 *
 * @class
 *
 * @extends Model
 * @exports Reports
 */
export default class Reports extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    articleId: Sequelize.UUID,
    userId: Sequelize.UUID,
    reason: Sequelize.STRING
  }

  /**
   * Initializes the Reports model
   *
   * @static
   * @memberof Reports
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Reports model
   */
  static init(sequelize) {
    const model = super.init(Reports.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Reports
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    Reports.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Reports.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  }
}
