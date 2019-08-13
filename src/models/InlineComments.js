import { Sequelize, Model } from 'sequelize';

/**
 * Model class for InlineComments
 *
 * @class
 *
 * @extends Model
 * @exports InlineComments
 */
export default class InlineComments extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    userId: Sequelize.UUID,
    articleId: Sequelize.UUID,
    content: Sequelize.STRING,
    highlightedText: Sequelize.STRING,
    context: Sequelize.STRING,
    highlightIndex: Sequelize.STRING,
    contextIndex: Sequelize.STRING,
    valid: Sequelize.BOOLEAN
  }

  /**
   * Initializes the InlineComments model
   *
   * @static
   * @memberof InlineComments
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the InlineComments model
   */
  static init(sequelize) {
    const model = super.init(InlineComments.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof InlineComments
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    InlineComments.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    InlineComments.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  }
}
