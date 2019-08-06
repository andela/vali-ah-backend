import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Sessions', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        sessionId: {
          allowNull: false,
          type: Sequelize.STRING,
          onDelete: 'CASCADE'
        },
        userId: {
          allowNull: false,
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
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
      await queryInterface.dropTable('Sessions');
    } catch (error) {
      debug(error);
    }
  }
};
