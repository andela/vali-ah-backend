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
    followerId: Sequelize.UUID,
    active: Sequelize.BOOLEAN
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

  /** Returns an array of authors the user is following
   *
   * @function
   *
   * @param {string} userId - id of the user following authors
   *
   * @returns {Array} - array of authors followed by user
   */
  static async getAuthors(userId) {
    return Followers.findAll({
      where: { followerId: userId }
    });
  }
}
