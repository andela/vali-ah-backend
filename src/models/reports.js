export default (sequelize, DataTypes) => {
  const Reports = sequelize.define(
    'Reports',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      articleId: DataTypes.UUIDV4,
      userId: DataTypes.UUIDV4,
      reason: DataTypes.STRING
    },
    {}
  );

  Reports.associate = (models) => {
    Reports.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Reports.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };

  return Reports;
};
