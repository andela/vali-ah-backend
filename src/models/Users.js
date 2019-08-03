import { Sequelize, Model } from 'sequelize';
import bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Model class for Users
 *
 * @class
 *
 * @extends Model
 * @exports Users
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
   * Initializes the Users model
   *
   * @static
   * @memberof Users
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Users model
   */
  static init(sequelize) {
    const model = super.init(Users.modelFields, { sequelize });

    model.beforeCreate(Users.beforeHook);
    model.afterCreate(this.afterCreateHook);

    return model;
  }

  /**
   * Get existing user
   *
   * @static
   * @memberof Users
   *
   * @param {string} email
   *
   * @return {Object | void} - details of existing user
   */
  static async getExistingUser(email) {
    const user = await Users.findOne({
      where: {
        email
      }
    });

    return user;
  }

  /**
   * Hook for the User model
   *
   * @static
   * @memberof User
   *
   * @param {Object} user
   *
   * @returns {Object} user to create or update
   */
  static beforeHook = async (user) => {
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.password = hash;

    return user;
  }

  /**
   * Hook (after creation) for the User model
   *
   * @static
   * @memberof User
   *
   * @param {Object} user
   *
   * @returns {Object} user to return
   */
  static afterCreateHook(user) {
    delete user.password;
    return user;
  }

  /**
   * Compares user password to hashed password
   *
   * @static
   * @memberof User
   *
   * @param {string} password
   * @param {string} hashedPassword
   *
   * @returns {boolean} true or false
   */
  static comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}
