export default (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    'Comments',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      content: DataTypes.STRING,
      userId: DataTypes.UUIDV4,
      articleId: DataTypes.UUIDV4,
      repliedToId: DataTypes.UUIDV4,
      suspended: DataTypes.BOOLEAN
    },
    {}
  );

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comments.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Comments.belongsTo(models.Comments, {
      foreignKey: 'repliedToId',
      onDelete: 'CASCADE'
    });
  };

  return Comments;
};
