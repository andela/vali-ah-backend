export default (sequelize, DataTypes) => {
  const Downvotes = sequelize.define(
    'Downvotes',
    {
      articleId: DataTypes.UUID,
      userId: DataTypes.UUID
    },
    {}
  );

  Downvotes.associate = (models) => {
    Downvotes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Downvotes.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };

  return Downvotes;
};
