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
