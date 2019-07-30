export default (sequelize, DataTypes) => {
  const categorys = sequelize.define(
    'categorys',
    {
      categorys: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  );

  categorys.associate = (models) => {
    categorys.hasOne(models.Articlescategorys, {
      foreignKey: 'categorysId',
      onDelete: 'CASCADE'
    });
  };

  return categorys;
};
