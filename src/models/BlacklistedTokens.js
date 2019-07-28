export default (sequelize, DataTypes) => {
  const BlacklistedTokens = sequelize.define(
    'BlacklistedTokens', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      userId: DataTypes.UUID,
      token: DataTypes.STRING
    }, {}
  );

  BlacklistedTokens.associate = (models) => {
    BlacklistedTokens.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return BlacklistedTokens;
};
