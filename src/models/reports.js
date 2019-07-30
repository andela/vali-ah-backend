export default (sequelize, DataTypes) => {
  const Reports = sequelize.define(
    'Reports',
    {
      articleId: DataTypes.UUID,
      userId: DataTypes.UUID,
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
      foreignKey: 'articleId'
    });
  };

  return Reports;
};
