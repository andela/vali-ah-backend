import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Articles', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUIDV4
        },
        authorId: {
          allowNull: false,
          foreignKey: true,
          type: Sequelize.UUIDV4,
          onDelete: 'CASCADE'
        },
        followUpId: {
          allowNull: false,
          foreignKey: true,
          type: Sequelize.UUIDV4,
          onDelete: 'CASCADE'
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING
        },
        summary: {
          allowNull: false,
          type: Sequelize.STRING
        },
        body: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        suspended: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        status: {
          allowNull: false,
          type: Sequelize.STRING,
          defaultValue: 'draft'
        },
        coverImageUrl: {
          type: Sequelize.STRING
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
      await queryInterface.dropTable('Articles');
    } catch (error) {
      debug(error);
    }
  }
};
