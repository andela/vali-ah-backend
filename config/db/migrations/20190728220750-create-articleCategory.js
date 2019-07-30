import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('ArticleCategories', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        articleId: {
          allowNull: false,
          foreignKey: true,
          type: Sequelize.UUID
        },
        categoryId: {
          allowNull: false,
          foreignKey: true,
          type: Sequelize.UUID
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
      await queryInterface.dropTable('ArticleCategories');
    } catch (error) {
      debug(error);
    }
  }
};
