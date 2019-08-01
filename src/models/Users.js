export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      roleId: DataTypes.UUID,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatarUrl: DataTypes.STRING
    }, {}
  );

  Users.associate = (models) => {
    Users.hasMany(models.Reports, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Followers, {
      as: 'followers',
      foreignKey: 'followeeId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Followers, {
      as: 'following',
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Bookmarks, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.ReadStats, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Votes, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Notifications, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Users;
};
