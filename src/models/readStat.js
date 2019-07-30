export default (sequelize, DataTypes) => {
  const ReadStats = sequelize.define(
    'Book',
    {
      articleId: DataTypes.UUID,
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
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };

  return ReadStats;
};
