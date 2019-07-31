import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Votes category
 *
 * @class
 *
 * @extends Model
 *
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
   * initializes the Votes model
   *
   * @static
   * @memberof Votes
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Votes model
   */
  static init(sequelize) {
    const model = super.init(Votes.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof Votes
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
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
