import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Votes
 *
 * @class
 *
 * @extends Model
 * @exports Votes
 */
export default class Votes extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    articleId: Sequelize.UUID,
    userId: Sequelize.UUID,
    upVote: Sequelize.BOOLEAN
  }

  /**
   * Initializes the Votes model
   *
   * @static
   * @memberof Votes
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Votes model
   */
  static init(sequelize) {
    const model = super.init(Votes.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Votes
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    Votes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Votes.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  }
}
