export default (sequelize, DataTypes) => {
  const ArticleCategories = sequelize.define(
    'ArticleCategories',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      articleId: DataTypes.UUIDV4,
      categoryId: DataTypes.UUIDV4
    },
    {}
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
