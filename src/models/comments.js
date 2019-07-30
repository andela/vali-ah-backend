export default (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    content: DataTypes.STRING,
    userId: DataTypes.UUID,
    ArticlesId: DataTypes.UUID,
    repliedToId: DataTypes.UUID,
    suspended: DataTypes.BOOLEAN
  },
  {});

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comments.belongsTo(models.Articles, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
    Comments.belongsTo(models.Comments, {
      foreignKey: 'repliedToId',
      onDelete: 'CASCADE'
    });
  };

  return Comments;
};
