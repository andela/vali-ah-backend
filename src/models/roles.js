export default (sequelize, DataTypes) => {
  const Roles = sequelize.define(
    'Roles',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  );

  return Roles;
};
