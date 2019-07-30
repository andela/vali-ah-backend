export default (sequelize, DataTypes) => {
  const Roles = sequelize.define(
    'Roles',
    {
      name: DataTypes.STRING,
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
