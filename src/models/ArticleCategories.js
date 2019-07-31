export default (sequelize, DataTypes) => {
  const ArticleCategories = sequelize.define(
    'ArticleCategories', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      articleId: DataTypes.UUID,
      categoryId: DataTypes.UUID
    }, {}
  );

  ArticleCategories.associate = (models) => {
    ArticleCategories.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    ArticleCategories.belongsTo(models.Categories, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
  };

  return ArticleCategories;
};
