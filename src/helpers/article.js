import Models from '../models/index';
import { ApplicationError } from './errors';

const uuidRegularExpression = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const {
  Categories,
} = Models;

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

export default {
  idPresent,
  checkTags,
  getTagName
};
