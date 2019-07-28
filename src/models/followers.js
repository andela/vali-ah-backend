export default (sequelize, DataTypes) => {
  const Followers = sequelize.define(
    'Followers', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      followeeId: DataTypes.UUID,
      followerId: DataTypes.UUID
    }, {}
  );

  Followers.associate = (models) => {
    Followers.belongsTo(models.Users, {
      as: 'following',
      foreignKey: 'followeeId',
      onDelete: 'CASCADE'
    });
    Followers.belongsTo(models.Users, {
      as: 'followers',
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
  };

  return Followers;
};
