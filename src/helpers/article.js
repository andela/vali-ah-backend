import dotenv from 'dotenv';
import Models from '../models/index';
import { ApplicationError } from './errors';

dotenv.config();

const appUrl = process.env.APP_URL;
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

/**
 * Create facebook share link
 *
 * @function
 *
 * @param {String} slug - article slug
 *
 * @returns {String} - facebook share link
 */
export const createFacebookShareLink = (slug) => {
  const articleUrl = `${appUrl}/api/v1/articles/${slug}`;
  const facebookShareLink = `https://web.facebook.com/sharer.php?u=${articleUrl}`;

  return facebookShareLink;
};

/**
 * Create twitter share link
 *
 * @function
 *
 * @param {String} slug - article slug
 *
 * @returns {String} - twitter share link
 */
export const createTwitterShareLink = (slug) => {
  const articleUrl = `${appUrl}/api/v1/articles/${slug}`;
  const twitterShareLink = `https://twitter.com/intent/tweet?text=${articleUrl}`;

  return twitterShareLink;
};

/**
 * Create linkedin share link
 *
 * @function
 *
 * @param {String} slug - article slug
 *
 * @returns {String} - linkedin share link
 */
export const createLinkedinShareLink = (slug) => {
  const articleUrl = `${appUrl}/api/v1/articles/${slug}`;
  // const naira = 'google.com';
  const linkedinShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`;

  return linkedinShareLink;
};
