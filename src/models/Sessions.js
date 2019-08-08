import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Followers
 *
 * @class
 *
 * @extends Model
 * @exports Sessions
 */
export default class Sessions extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    sessionId: Sequelize.STRING,
    userId: Sequelize.UUID
  }

  /**
   * Initializes the Sessions model
   *
   * @static
   * @memberof Sessions
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Sessions model
   */
  static init(sequelize) {
    const model = super.init(Sessions.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Sessions
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    Sessions.belongsTo(models.Users, {
      as: 'session',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Sessions
   *
   * @param {Object} sessionData
   * @param {string} sessionData.sessionId - session's id
   * @param {string} sessionData.userId - user's id
   *
   * @returns {void} no return
   */
  static async saveSession({ sessionId, userId }) {
    const sessionData = { userId, sessionId };
    const sessionObject = await this.findOne({ where: { userId } });

    if (sessionObject) return sessionObject.update(sessionData);

    return this.create({ userId, sessionId }, { updateOnDuplicate: ['sessionId'] });
  }
}
