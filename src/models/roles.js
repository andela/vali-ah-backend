export default (sequelize, DataTypes) => {
  const Roles = sequelize.define(
    'Roles',
    {
      RolesName: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  );
  Roles.associate = (models) => {
    Roles.hasMany(models.Permissions, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE'
    });
  };

  return Roles;
};
