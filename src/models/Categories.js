export default (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    'Categories', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      category: DataTypes.STRING,
      description: DataTypes.STRING
    }, {}
  );

  Categories.associate = (models) => {
    Categories.hasMany(models.ArticleCategories, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
  };

  return Categories;
};
