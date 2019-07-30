export default (sequelize, DataTypes) => {
  const Followers = sequelize.define(
    'Followers',
    {
      userId: DataTypes.UUID,
      FollowersId: DataTypes.UUID
    },
    {}
  );

  Followers.associate = (models) => {
    Followers.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Followers.belongsTo(models.Users, {
      foreignKey: 'FollowersId',
      onDelete: 'CASCADE'
    });
  };

  return Followers;
};
