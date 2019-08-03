import { Sequelize, Model } from 'sequelize';

/**
 * Model class for ReadStats
 *
 * @class
 *
 * @extends Model
 * @exports ReadStats
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
   * Initializes the ReadStats model
   *
   * @static
   * @memberof ReadStats
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the ReadStats model
   */
  static init(sequelize) {
    const model = super.init(ReadStats.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof ReadStats
   *
   * @param {any} models all models
   *
   * @returns {void} no return
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
