export default (sequelize, DataTypes) => {
  const Articles = sequelize.define(
    'Articless',
    {
      title: DataTypes.STRING,
      summary: DataTypes.STRING,
      body: DataTypes.TEXT,
      suspended: DataTypes.BOOLEAN,
      Status: DataTypes.STRING,
      coverImageUrl: DataTypes.STRING,
      followUpId: DataTypes.UUID,
      AuthorId: DataTypes.UUID
    },
    {}
  );

  Articles.associate = (models) => {
    Articles.belongsTo(models.Authors, {
      foreignKey: 'AuthorId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Bookmarks, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Reports, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
    Articles.hasMany(models.UpVotes, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
    Articles.hasMany(models.downVotes, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
    Articles.hasMany(models.Comments, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
    Articles.hasMany(models.Articlescategorys, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
    Articles.hasMany(models.ReadStats, {
      foreignKey: 'ArticlesId',
      onDelete: 'CASCADE'
    });
    Articles.hasMany(models.Articles, {
      foreignKey: 'followUpId',
      onDelete: 'CASCADE'
    });
  };

  return Articles;
};
