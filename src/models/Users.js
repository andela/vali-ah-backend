import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Users
 *
 * @class
 *
 * @extends Model
 *
 */
export default class Users extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    roleId: Sequelize.UUID,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    userName: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    avatarUrl: Sequelize.STRING
  }

  /**
   * initializes the User model
   *
   * @static
   * @memberof User
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the User model
   */
  static init(sequelize) {
    const model = super.init(Users.modelFields, {
      sequelize
    });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof User
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
   */
  static associate() {

  }
}
