
export default {
  up: async (queryInterface, Sequelize) => {
    try {
      queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        firstName: {
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING
        },
        email: {
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
      console.log(error);
    }
  },
  down: async (queryInterface) => {
    try {
      queryInterface.dropTable('Users');
    } catch (error) {
      console.log(error);
    }
  }
};
