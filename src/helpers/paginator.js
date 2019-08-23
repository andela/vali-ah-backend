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
  const {
    page,
    limit,
    dataSource,
    dataToSource,
    ...otherOptions
  } = options;

  if (!Source) {
    return { data: await dataSource({ data: dataToSource, options: otherOptions }) };
  }

  const countResult = await Source.findAndCountAll({ ...otherOptions });
  const { count } = countResult;

  if (!count) throw new NotFoundError('No articles found');

  const offset = limit * (+page - 1);

  const data = await Source.findAll({ ...otherOptions, limit, offset });

  return { data, count, currentCount: data.length };
};

export default paginator;
