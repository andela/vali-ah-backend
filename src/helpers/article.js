import Sequelize from 'sequelize';
import models from '../models';
import { ApplicationError } from './errors';

const uuidRegularExpression = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const { Op } = Sequelize;
const { Users, Categories, Articles } = models;

/**
 * find id in given table and returns article array or undefined
 *
 * @function
 *
 * @param {uuid} id - id to be sort
 * @param {Object} table - table to querry
 *
 * @returns {Object} - array or undefined
 */
export const idPresent = async (id, table) => {
  const Id = await table.findOne({
    where: {
      id
    }
  });
  return Id;
};

/**
 * validates given tags and throws error if any is invalid
 *
 * @function
 *
 * @param {Array} tag - tag to validate
 *
 * @returns {void} - returns nothing
 */
export const checkTags = async (tag) => {
  if (tag) {
    tag.forEach((eachTag) => {
      if (tag.length > 2) throw new ApplicationError(400, 'Tags can only be a maximum of 2');
      if (!uuidRegularExpression.test(eachTag)) throw new ApplicationError(400, 'Tag contains an invalid value');
    });
    const availableCategory = await Categories.checkTagsExistence(tag);

    const idsPresent = availableCategory.map(eachCategory => eachCategory.dataValues.id);
    const resp = tag.filter(eachTag => !idsPresent.includes(eachTag));

    if (resp.length) throw new ApplicationError(400, ` The following category Ids ${resp} are not available yet`);
  }
};

/**
 *converts tag ids to tag names
 *
 * @function
 *
 * @param {Array} tags - tag to validate
 *
 * @returns {Array} - returns an array of tag names
 */
export const getTagName = async (tags) => {
  const res = await Categories.checkTagsExistence(tags);
  const tagNames = res.map(eachTag => eachTag.category);
  return tagNames;
};

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
 * @returns {Object} - sequlize Object
 */
const filter = (title, tag, author, keyword) => {
  const queryParams = {
    query: {
      '$article.title$': { [Op.iLike]: `%${title}%` },
      '$tag.category$': { [Op.iLike]: `%${tag}%` },
    },
    author: {
      [Op.or]: {
        '$author.firstName$': { [Op.iLike]: `%${author}%` },
        '$author.lastName$': { [Op.iLike]: `%${author}%` },
        '$author.userName$': { [Op.iLike]: `%${author}%` },
      },
    },
    keyword: {
      [Op.or]: {
        '$article.title$': { [Op.iLike]: `%${keyword}%` },
        '$tag.category$': { [Op.iLike]: `${keyword}` },
        '$author.firstName$': { [Op.iLike]: `%${keyword}%` },
        '$author.lastName$': { [Op.iLike]: `%${keyword}%` },
        '$author.userName$': { [Op.iLike]: `%${keyword}%` },
      },
    },
  };

  if (!title) delete queryParams.query['$article.title$'];
  if (!tag) delete queryParams.query['$tag.category$'];

  let filterQuery;

  if (keyword) {
    filterQuery = { ...queryParams.keyword };
  }
  if (author) {
    filterQuery = { ...queryParams.author };
  } else {
    filterQuery = { ...queryParams.query };
  }

  const hasFilterQuery = keyword || title || tag || author;

  return {
    include: [
      { model: Users, as: 'author' },
      { model: Articles, as: 'article' },
      { model: Categories, as: 'tag' },
    ],
    where: hasFilterQuery && { ...filterQuery }
  };
};

/**
 * function for extract article
 *
 * @function
 *
 * @param {result} result - array of object
 *
 * @returns {Object} - callback that execute the controller
 */
const extractArticles = result => result.reduce((accumulator, entry) => {
  const firstName = entry['author.firstName'];
  const lastName = entry['author.lastName'];
  const userName = entry['author.userName'];
  const createdAt = entry['author.createdAt'];
  const ArticleId = entry['article.id'];
  const item = accumulator.find(value => value.ArticleId === entry.articleId);

  if (item) {
    if (item.category.includes(entry['tag.category'])) return accumulator;
    item.category.push(entry['tag.category']);

    return accumulator;
  }

  const newEntry = {
    ArticleId,
    title: entry['article.title'],
    summary: entry['article.summary'],
    body: entry['article.body'],
    suspended: entry['article.suspended'],
    status: entry['article.status'],
    coverImageUrl: entry['article.coverImageUrl'],
    followUpId: entry['article.followUpId'],
    createdAt: entry['article.createdAt'],
    author: { name: `${firstName} ${lastName}`, userName, createdAt },
    category: [entry['tag.category']],
  };
  accumulator[accumulator.length] = newEntry;

  return accumulator;
}, []);

export default {
  idPresent,
  checkTags,
  getTagName,
  filter,
  extractArticles
};
