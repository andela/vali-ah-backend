import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Bookmarks
 *
 * @class
 *
 * @extends Model
 *
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
   * initializes the Bookmarks model
   *
   * @static
   * @memberof Bookmarks
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Bookmarks model
   */
  static init(sequelize) {
    const model = super.init(Bookmarks.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof Bookmarks
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
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
