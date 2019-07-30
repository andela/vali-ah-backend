export default (sequelize, DataTypes) => {
  const BlacklistedTokens = sequelize.define(
    'BlacklistedTokens',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      userId: DataTypes.UUIDV4,
      token: DataTypes.STRING
    },
    {}
  );

  BlacklistedTokens.associate = (models) => {
    BlacklistedTokens.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return BlacklistedTokens;
};
