import { Sequelize, Model } from 'sequelize';

/**
 * Model class for BlacklistedTokens
 *
 * @class
 *
 * @extends Model
 * @exports BlacklistedTokens
 */
export default class BlacklistedTokens extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    userId: Sequelize.UUID,
    token: Sequelize.STRING
  }

  /**
   * Initializes the BlacklistedTokens model
   *
   * @static
   * @memberof BlacklistedTokens
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the BlacklistedTokens model
   */
  static init(sequelize) {
    const model = super.init(BlacklistedTokens.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof BlacklistedTokens
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    BlacklistedTokens.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }
}
