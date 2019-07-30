import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Categories', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        category: {
          allowNull: false,
          type: Sequelize.STRING
        },
        description: {
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
      await queryInterface.dropTable('Categories');
    } catch (error) {
      debug(error);
    }
  }
};
