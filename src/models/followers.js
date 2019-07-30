export default (sequelize, DataTypes) => {
  const Followers = sequelize.define(
    'Followers',
    {
      userId: DataTypes.UUID,
      followerId: DataTypes.UUID
    },
    {}
  );

  Followers.associate = (models) => {
    Followers.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Followers.belongsTo(models.Users, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
  };

  return Followers;
};
