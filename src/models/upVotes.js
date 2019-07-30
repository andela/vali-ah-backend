export default (sequelize, DataTypes) => {
  const UpVotes = sequelize.define(
    'UpVotes',
    {
      ArticlesId: DataTypes.UUID,
      userId: DataTypes.UUID,
      downVoteId: DataTypes.UUID
    },
    {}
  );

  UpVotes.associate = (models) => {
    UpVotes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    UpVotes.belongsTo(models.Articles, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
    UpVotes.belongsTo(models.downVotes, {
      foreignKey: 'downVoteId',
      onDelete: 'CASCADE'
    });
  };

  return UpVotes;
};
