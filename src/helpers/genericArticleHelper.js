import Sequelize from 'sequelize';
import models from '../models';

const { Op } = Sequelize;
const { Users, Categories, Articles } = models;

/**
   * filter for search article
   *
   * @function
   *
   * @param {title} title - express request object
   * @param {tag} tag - express request object
   * @param {author} author - express request object
   * @param {keyword} keyword - express request object
   *
   * @return {Object} - sequlize Object
   */
const filter = (title, tag, author, keyword) => {
  const queryParams = {
    query: {
      '$article.title$': { [Op.iLike]: `%${title}%` },
      '$tag.category$': { [Op.iLike]: `${tag}` },
    },
    author: {
      [Op.or]: {
        '$author.firstName$': { [Op.iLike]: `%${author}%` },
        '$author.lastName$': { [Op.iLike]: `%${author}%` },
        '$author.userName$': { [Op.iLike]: `%${author}%` }
      }
    },
    keyword: {
      [Op.or]: {
        '$article.title$': { [Op.iLike]: `%${keyword}%` },
        '$tag.category$': { [Op.iLike]: `${keyword}` },
        '$author.firstName$': { [Op.iLike]: `%${keyword}%` },
        '$author.lastName$': { [Op.iLike]: `%${keyword}%` },
        '$author.userName$': { [Op.iLike]: `%${keyword}%` },
      }
    }
  };

  if (!title) delete queryParams.query['$article.title$'];
  if (!tag) delete queryParams.query['$tag.category$'];

  // eslint-disable-next-line no-nested-ternary
  const filterQuery = (keyword) ? { ...queryParams.keyword } : author ? { ...queryParams.author }
    : { ...queryParams.query };

  return {
    include: [{ model: Users, as: 'author' }, { model: Articles, as: 'article' }, { model: Categories, as: 'tag' }],
    where: (keyword || title || tag || author) ? {
      ...filterQuery
    } : undefined
  };
};

/**
   * function for extract article
   *
   * @function
   *
   * @param {result} result - array of object
   *
   * @return {Object} - callback that execute the controller
   */
const extractArticles = result => result.map((entry) => {
  const firstName = entry['author.firstName'];
  const lastName = entry['author.lastName'];
  const userName = entry['author.userName'];
  const createdAt = entry['author.createdAt'];
  return {
    ArticleId: entry['article.id'],
    title: entry['article.title'],
    tag: entry['tag.category'],
    summary: entry['article.summary'],
    body: entry['article.body'],
    suspended: entry['article.suspended'],
    status: entry['article.status'],
    coverImageUrl: entry['article.coverImageUrl'],
    followUpId: entry['article.followUpId'],
    createdAt: entry['article.createdAt'],
    author: { name: `${firstName} ${lastName}`, userName, createdAt },
    tags: entry.tag,
  };
});

export default {
  filter,
  extractArticles
};
