export default (sequelize, DataTypes) => {
  const Bookmarks = sequelize.define(
    'Bookmarks',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      articleId: DataTypes.UUIDV4,
      userId: DataTypes.UUIDV4
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
