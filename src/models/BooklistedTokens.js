export default (sequelize, DataTypes) => {
  const BlacklistedTokens = sequelize.define(
    'BlacklistedTokens',
    {
      ArticlesId: DataTypes.UUID,
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
