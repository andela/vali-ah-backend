export default (sequelize, DataTypes) => {
  const ArticleCategories = sequelize.define(
    'ArticleCategories',
    {
      authorId: DataTypes.UUID,
      categoryId: DataTypes.UUID
    },
    {}
  );

  ArticleCategories.associate = (models) => {
    ArticleCategories.belongsTo(models.Articles, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE'
    });
    ArticleCategories.belongsTo(models.Categories, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
  };

  return ArticleCategories;
};
