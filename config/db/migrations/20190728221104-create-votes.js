import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Votes', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        userId: {
          allowNull: false,
          foreignKey: true,
          type: Sequelize.UUID,
          onDelete: 'CASCADE'
        },
        articleId: {
          allowNull: false,
          foreignKey: true,
          type: Sequelize.UUID,
          onDelete: 'CASCADE'
        },
        upVote: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now')
        }
      });
    } catch (error) {
      debug(error);
    }
  },
  down: async (queryInterface) => {
    try {
      await queryInterface.dropTable('Upvotes');
    } catch (error) {
      debug(error);
    }
  }
};
