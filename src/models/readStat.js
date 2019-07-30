export default (sequelize, DataTypes) => {
  const ReadStats = sequelize.define(
    'Book',
    {
      ArticlesId: DataTypes.UUID,
      userId: DataTypes.UUID
    },
    {}
  );

  ReadStats.associate = (models) => {
    ReadStats.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    ReadStats.belongsTo(models.Articles, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
  };

  return ReadStats;
};
