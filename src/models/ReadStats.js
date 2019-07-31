import { Sequelize, Model } from 'sequelize';

/**
 * Model class for  ReadStats category
 *
 * @class
 *
 * @extends Model
 *
 */
export default class ReadStats extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    articleId: Sequelize.UUID,
    userId: Sequelize.UUID
  }

  /**
   * initializes the ReadStats model
   *
   * @static
   * @memberof ReadStats
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the ReadStats model
   */
  static init(sequelize) {
    const model = super.init(ReadStats.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof ReadStats
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
   */
  static associate(models) {
    ReadStats.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    ReadStats.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  }
}
