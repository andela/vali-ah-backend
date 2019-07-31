export default (sequelize, DataTypes) => {
  const Articles = sequelize.define(
    'Articles', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      title: DataTypes.STRING,
      summary: DataTypes.STRING,
      body: DataTypes.TEXT,
      suspended: DataTypes.BOOLEAN,
      status: DataTypes.STRING,
      coverImageUrl: DataTypes.STRING,
      followUpId: DataTypes.UUID,
      authorId: DataTypes.UUID
    }, {}
  );

  Articles.associate = (models) => {
    Articles.belongsTo(models.Users, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Bookmarks, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Reports, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Votes, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Comments, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.ArticleCategories, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.ReadStats, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Articles.hasMany(models.Articles, {
      foreignKey: 'followUpId',
      onDelete: 'CASCADE'
    });
  };

  return Articles;
};
