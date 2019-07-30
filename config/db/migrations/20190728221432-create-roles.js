import Debug from 'debug';
import UUID from 'uuid/v4';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Roles', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUIDV4,
          defaultValue: UUID()
        },
        name: {
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
      await queryInterface.dropTable('Roles');
    } catch (error) {
      debug(error);
    }
  }
};
