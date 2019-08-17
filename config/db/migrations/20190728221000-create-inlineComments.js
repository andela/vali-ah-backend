import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('InlineComments', {
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
          allowNull: false,
          type: Sequelize.STRING
        },
        highlightedText: {
          allowNull: false,
          type: Sequelize.STRING
        },
        context: {
          allowNull: false,
          type: Sequelize.STRING
        },
        highlightIndex: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        contextIndex: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        valid: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
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
      await queryInterface.dropTable('InlineComments');
    } catch (error) {
      debug(error);
    }
  }
};
