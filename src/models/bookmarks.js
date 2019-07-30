export default (sequelize, DataTypes) => {
  const Bookmarks = sequelize.define(
    'Bookmarks',
    {
      articleId: DataTypes.UUID,
      userId: DataTypes.UUID,
      isActive: DataTypes.BOOLEAN
    },
    {}
  );

  Bookmarks.associate = (models) => {
    Bookmarks.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Bookmarks.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };

  return Bookmarks;
};
