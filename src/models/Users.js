import { Sequelize, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import { NotFoundError } from '../helpers/errors';

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
    isAdmin: Sequelize.BOOLEAN,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    userName: Sequelize.STRING,
    email: Sequelize.STRING,
    notify: Sequelize.BOOLEAN,
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

  /**
   * Get User's Followers
   *
   * @static
   * @memberof User
   *
   * @param {Object} query
   * @param {Object} query.data - details to be used in the query
   * @param {Object} query.options - extra options to pass to sequlize
   *
   * @returns {boolean} true or false
   */
  static async getUserFollowers({ data, options = {} }) {
    const { user } = data;

    const userObject = await Users.findByPk(user);

    if (!userObject) throw new NotFoundError();

    return userObject.getFollowers({
      attributes: ['id'],
      order: ['id'],
      include: [
        {
          model: Users, as: 'followers', attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      ...options
    });
  }

  /**
   * Get Users name
   *
   * @static
   * @memberof User
   *
   * @param {string} user
   *
   * @returns {string} users name
   */
  static async getUserName(user) {
    const { firstName, lastName } = await this.findByPk(user, { attributes: ['firstName', 'lastName'] });

    return `${firstName} ${lastName}`;
  }


  /**
   * Get single user
   *
   * @static
   * @memberof User
   *
   * @param {string} user
   *
   * @returns {string} users name
   */
  static async getSingleUser(user) {
    const userObject = await this.findByPk(user, { include: [{ model: this.models.Sessions, as: 'session' }] });

    if (!userObject) throw new NotFoundError();

    return userObject.toJSON();
  }

  /**
   *  Model associations
   *
   * @static
   * @memberof Users
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    this.hasMany(models.Followers, {
      foreignKey: 'followeeId',
      as: 'followers',
      onDelete: 'CASCADE'
    });

    this.hasOne(models.Sessions, {
      foreignKey: 'userId',
      as: 'session',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.Followers, {
      foreignKey: 'followerId',
      as: 'following',
      onDelete: 'CASCADE'
    });
  }
}
