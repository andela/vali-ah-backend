import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('UpVotes', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        userId: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        ArticlesId: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        downVoteId: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    } catch (error) {
      debug(error);
    }
  },
  down: async (queryInterface) => {
    try {
      await queryInterface.dropTable('UpVotes');
    } catch (error) {
      debug(error);
    }
  }
};
