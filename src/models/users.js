export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatarUrl: DataTypes.STRING,
      roleId: DataTypes.UUID
    },
    {}
  );

  Users.associate = (models) => {
    Users.hasMany(models.Permissions, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Users.hasMany(models.Reports, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Followers, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Bookmarks, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Authors, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.ReadStats, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Upvotes, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Users.hasMany(models.Downvotes, {
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
