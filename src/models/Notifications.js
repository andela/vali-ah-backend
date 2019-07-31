import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Notifications
 *
 * @class
 *
 * @extends Model
 *
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
   * initializes the User model
   *
   * @static
   * @memberof Notifications
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Notifications model
   */
  static init(sequelize) {
    const model = super.init(Notifications.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof Notifications
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
   */
  static associate(models) {
    Notifications.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }
}
