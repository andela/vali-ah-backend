import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Notifications
 *
 * @class
 *
 * @extends Model
 * @exports Notifications
 */
export default class Notifications extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    event: Sequelize.STRING,
    userId: Sequelize.UUID,
    email: Sequelize.STRING,
    payload: Sequelize.JSON,
    notified: Sequelize.BOOLEAN
  }

  /**
   * Initializes the Notifications model
   *
   * @static
   * @memberof Notifications
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Notifications model
   */
  static init(sequelize) {
    const model = super.init(Notifications.modelFields, { sequelize });

    return model;
  }

  /**
   * Get batched notification
   *
   * @static
   * @memberof Notifications
   *
   * @param {Object} options - sequelize valid options
   *
   * @returns {Object} sequelize data object
   */
  static async getBatchedNotifications({ options = {} }) {
    return Notifications
      .findAll({
        group: ['userId', 'event', 'Notifications.email', 'notified', 'Notifications.id', 'User.id'],
        where: { notified: false },
        attributes: ['userId', 'event', 'email', 'notified', 'id', [Sequelize.fn('array_agg', Sequelize.col('payload')), 'payload']],
        include: [{ model: Notifications.models.Users, where: { notify: true }, attributes: ['notify'] }],
        ...options
      });
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Notifications
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    Notifications.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }
}
