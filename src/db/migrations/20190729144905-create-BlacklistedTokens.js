import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('BlacklistedTokens', {
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
        token: {
          allowNull: false,
          type: Sequelize.STRING
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
      await queryInterface.dropTable('BlacklistedTokens');
    } catch (error) {
      debug(error);
    }
  }
};
