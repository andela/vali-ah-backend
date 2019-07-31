import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Reports category
 *
 * @class
 *
 * @extends Model
 *
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
   * initializes the Reports model
   *
   * @static
   * @memberof Reports
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Reports model
   */
  static init(sequelize) {
    const model = super.init(Reports.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof Reports
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
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
