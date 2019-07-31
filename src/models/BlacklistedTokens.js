import { Sequelize, Model } from 'sequelize';

/**
 * Model class for BlacklistTokens
 *
 * @class
 *
 * @extends Model
 *
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
   * initializes the User model
   *
   * @static
   * @memberof BlacklistTokens
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the BlacklistTokens model
   */
  static init(sequelize) {
    const model = super.init(BlacklistedTokens.modelFields, { sequelize });

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
    BlacklistedTokens.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }
}
