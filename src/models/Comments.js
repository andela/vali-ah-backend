import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Comments
 *
 * @class
 *
 * @extends Model
 * @exports Comments
 */
export default class Comments extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    content: Sequelize.STRING,
    userId: Sequelize.UUID,
    articleId: Sequelize.UUID,
    repliedToId: Sequelize.UUID,
    suspended: Sequelize.BOOLEAN
  }

  /**
   * Initializes the Comments model
   *
   * @static
   * @memberof Comments
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Comments model
   */
  static init(sequelize) {
    const model = super.init(Comments.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Comments
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    Comments.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comments.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Comments.belongsTo(models.Comments, {
      foreignKey: 'repliedToId',
      onDelete: 'CASCADE'
    });
  }
}
