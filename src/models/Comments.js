import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Comments
 *
 * @class
 *
 * @extends Model
 *
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
   * initializes the User model
   *
   * @static
   * @memberof Comments
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the User model
   */
  static init(sequelize) {
    const model = super.init(Comments.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof Comments
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
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
