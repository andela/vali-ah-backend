import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('Articlescategoryss', {
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
        categorysId: {
          allowNull: false,
          primaryKey: true,
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
      await queryInterface.dropTable('Articlescategoryss');
    } catch (error) {
      debug(error);
    }
  }
};
