import { NotFoundError } from './errors';

/**
 * Implements pagination support
 *
 * @function
 *
 * @param {Object} Source - Model object
 * @param {Object} options
 *
 * @returns {Object} returns object
 */
const paginator = async (Source, options) => {
  const countResult = await Source.findAndCountAll({});
  const { page, limit, ...otherOptions } = options;
  const { count } = countResult;

  if (!count) throw new NotFoundError('No articles found');

  const pages = Math.ceil(count / limit);
  const offset = limit * (+page - 1);

  if (page > pages) throw new NotFoundError('Page does not exist');

  const data = await Source.findAll({ ...otherOptions, limit, offset });

  return { data, count };
};

export default paginator;
