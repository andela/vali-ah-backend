import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Followers
 *
 * @class
 *
 * @extends Model
 * @exports Followers
 */
export default class Followers extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    followeeId: Sequelize.UUID,
    followerId: Sequelize.UUID
  }

  /**
   * Initializes the Followers model
   *
   * @static
   * @memberof Followers
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Followers model
   */
  static init(sequelize) {
    const model = super.init(Followers.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Followers
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    Followers.belongsTo(models.Users, {
      as: 'following',
      foreignKey: 'followeeId',
      onDelete: 'CASCADE'
    });
    Followers.belongsTo(models.Users, {
      as: 'followers',
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
  }
}
