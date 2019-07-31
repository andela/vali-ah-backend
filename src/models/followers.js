export default (sequelize, DataTypes) => {
  const Followers = sequelize.define(
    'Followers',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      followeeId: DataTypes.UUIDV4,
      followerId: DataTypes.UUIDV4
    },
    {}
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
