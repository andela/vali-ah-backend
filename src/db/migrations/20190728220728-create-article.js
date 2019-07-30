import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Articles', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        AuthorId: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
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
          type: Sequelize.STRING
        },
        suspended: {
          allowNull: false,
          type: Sequelize.STRING
        },
        Status: {
          allowNull: false,
          type: Sequelize.STRING,
          defaultValue: 'active'
        },
        coverImageUrl: {
          type: Sequelize.STRING
        },
        followerUpId: {
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
      await queryInterface.dropTable('Articles');
    } catch (error) {
      debug(error);
    }
  }
};
