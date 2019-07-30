export default (sequelize, DataTypes) => {
  const Permissions = sequelize.define(
    'Permissions',
    {
      userId: DataTypes.UUID,
      code: DataTypes.BIGINT,
      roleId: DataTypes.UUID
    },
    {}
  );

  Permissions.associate = (models) => {
    Permissions.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Permissions.belongsTo(models.Roles, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE'
    });
  };

  return Permissions;
};
