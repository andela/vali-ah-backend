export default (sequelize, DataTypes) => {
  const ReadStats = sequelize.define(
    'ReadStats',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      articleId: DataTypes.UUIDV4,
      userId: DataTypes.UUIDV4
    },
    {}
  );

  ReadStats.associate = (models) => {
    ReadStats.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    ReadStats.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };

  return ReadStats;
};
