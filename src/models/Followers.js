import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Followers category
 *
 * @class
 *
 * @extends Model
 *
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
   * initializes the Followers model
   *
   * @static
   * @memberof Followers
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Followers model
   */
  static init(sequelize) {
    const model = super.init(Followers.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof Followers
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
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
