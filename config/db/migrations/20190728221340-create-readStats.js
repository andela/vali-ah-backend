import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('ReadStats', {
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
      await queryInterface.dropTable('ReadStats');
    } catch (error) {
      debug(error);
    }
  }
};
