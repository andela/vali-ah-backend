export default (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    'Categories',
    {
      category: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  );

  Categories.associate = (models) => {
    Categories.hasOne(models.ArticleCategories, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
  };

  return Categories;
};
