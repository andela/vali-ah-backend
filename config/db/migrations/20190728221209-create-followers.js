import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Followers', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        followeeId: {
          allowNull: false,
          foreignKey: true,
          type: Sequelize.UUID,
          onDelete: 'CASCADE'
        },
        followerId: {
          allowNull: false,
          foreignKey: true,
          type: Sequelize.UUID,
          onDelete: 'CASCADE'
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
      await queryInterface.dropTable('Followers');
    } catch (error) {
      debug(error);
    }
  }
};
