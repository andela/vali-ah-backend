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
  let data = [];
  const {
    page,
    limit,
    dataSource,
    dataToSource,
    ...otherOptions
  } = options;
  const offset = limit * (+page - 1);

  if (!Source) {
    const { data: result, count } = await dataSource({
      data: dataToSource,
      options: {
        limit,
        offset,
        ...otherOptions
      }
    });

    return { data: result, count };
  }

  const { count } = await Source.findAndCountAll({ ...otherOptions });

  if (count) {
    data = await Source.findAll({ ...otherOptions, limit, offset });
  }

  return { data, count };
};

export default paginator;
