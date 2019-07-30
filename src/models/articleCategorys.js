export default (sequelize, DataTypes) => {
  const Articlescategorys = sequelize.define(
    'Articlescategoryss',
    {
      AuthorId: DataTypes.UUID,
      categorysId: DataTypes.UUID
    },
    {}
  );

  Articlescategorys.associate = (models) => {
    Articlescategorys.belongsTo(models.Articles, {
      foreignKey: 'AuthorId',
      onDelete: 'CASCADE'
    });
    Articlescategorys.belongsTo(models.categorys, {
      foreignKey: 'categorysId',
      onDelete: 'CASCADE'
    });
  };

  return Articlescategorys;
};
