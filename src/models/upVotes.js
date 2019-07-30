export default (sequelize, DataTypes) => {
  const Upvotes = sequelize.define(
    'Upvotes',
    {
      articleId: DataTypes.UUID,
      userId: DataTypes.UUID
    },
    {}
  );

  Upvotes.associate = (models) => {
    Upvotes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Upvotes.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };

  return Upvotes;
};
