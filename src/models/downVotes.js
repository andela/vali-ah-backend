export default (sequelize, DataTypes) => {
  const downVotes = sequelize.define(
    'downVotes',
    {
      ArticlesId: DataTypes.UUID,
      userId: DataTypes.UUID,
      UpVoteId: DataTypes.UUID
    },
    {}
  );

  downVotes.associate = (models) => {
    downVotes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    downVotes.belongsTo(models.Articles, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
    downVotes.belongsTo(models.UpVotes, {
      foreignKey: 'UpVoteId',
      onDelete: 'CASCADE'
    });
  };

  return downVotes;
};
