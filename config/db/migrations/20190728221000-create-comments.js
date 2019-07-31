import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Comments', {
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
        content: {
          type: Sequelize.STRING
        },
        repliedToId: {
          foreignKey: true,
          type: Sequelize.UUID,
        },
        suspended: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
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
      await queryInterface.dropTable('Comments');
    } catch (error) {
      debug(error);
    }
  }
};
