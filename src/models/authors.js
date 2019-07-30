export default (sequelize, DataTypes) => {
  const Authors = sequelize.define(
    'Authors',
    {
      userId: DataTypes.UUID,
      noOfPublication: DataTypes.BIGINT
    },
    {}
  );

  Authors.associate = (models) => {
    Authors.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Authors.hasMany(models.Articles, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE'
    });
  };

  return Authors;
};
