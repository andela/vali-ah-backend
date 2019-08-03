import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Bookmarks
 *
 * @class
 *
 * @extends Model
 * @exports Bookmarks
 */
export default class Bookmarks extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    articleId: Sequelize.UUID,
    userId: Sequelize.UUID
  }

  /**
   * Initializes the Bookmarks model
   *
   * @static
   * @memberof Bookmarks
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Bookmarks model
   */
  static init(sequelize) {
    const model = super.init(Bookmarks.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Bookmarks
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    Bookmarks.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Bookmarks.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  }
}
