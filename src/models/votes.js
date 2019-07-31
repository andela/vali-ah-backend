export default (sequelize, DataTypes) => {
  const Votes = sequelize.define(
    'Votes', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      articleId: DataTypes.UUID,
      userId: DataTypes.UUID,
      upVote: DataTypes.BOOLEAN
    }, {}
  );

  Votes.associate = (models) => {
    Votes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Votes.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };

  return Votes;
};
