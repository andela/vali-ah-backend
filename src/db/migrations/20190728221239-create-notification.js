import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Notifications', {
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
        event: {
          allowNull: false,
          type: Sequelize.STRING
        },
        payload: {
          allowNull: false,
          type: Sequelize.JSON
        },
        notified: {
          allowNull: false,
          type: Sequelize.BOOLEAN
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
      await queryInterface.dropTable('Notifications');
    } catch (error) {
      debug(error);
    }
  }
};
