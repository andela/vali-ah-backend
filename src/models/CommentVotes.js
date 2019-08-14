import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Comment Votes
 *
 * @class
 *
 * @extends Model
 * @exports CommentVotes
 */
export default class CommentVotes extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    commentId: Sequelize.UUID,
    userId: Sequelize.UUID,
    vote: Sequelize.BOOLEAN
  };

  /**
   * Initializes the CommentVotes model
   *
   * @static
   * @memberof CommentVotes
   *
   * @param {any} sequelize the sequelize object
   *
   * @returns {Object} the CommentVotes model
   */
  static init(sequelize) {
    const model = super.init(CommentVotes.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof CommentVotes
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    CommentVotes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    CommentVotes.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  }

  /**
   * method to upsert vote
   *
   * @static
   * @memberof CommentVotes
   *
   * @param {Object} voteData
   * @param {string} voteData.userId
   * @param {string} voteData.commentId
   * @param {boolean} voteData.vote
   *
   * @returns {Object} vote data
   */
  static async upsertCommentVotes({ userId, commentId, vote }) {
    const voteObject = await this.findOne({ where: { userId, commentId } });

    if (voteObject) {
      return { created: false, data: await voteObject.update({ userId, commentId, vote }) };
    }

    return { created: true, data: await this.create({ userId, commentId, vote }) };
  }
}
