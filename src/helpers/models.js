import async from 'async';
import Sequelize from 'sequelize';


/**
 * paginates sequelize model query
 *
 * @function
 *
 * @param {Function} sourceFunction - function to call as data source
 * @param {Object} dataToFunction - data to pass to source function as parameter
 * @param {number} size - size of data to return per page
 *
 * @returns {Object} - sequelize object for inserted data
 */
export const queryPagination = async (sourceFunction, dataToFunction = {}, size = 50) => {
  let currentPage = 0;
  let offset = currentPage;
  let limit = size;

  let dataFromSource = await sourceFunction({ data: dataToFunction, options: { limit, offset } });

  return {
    async next() {
      currentPage += 1;
      offset = currentPage * size;
      limit = offset + size;

      dataFromSource = await sourceFunction({
        data: dataToFunction, options: { limit, offset }
      }, { limit, offset });

      return this;
    },
    data() {
      return dataFromSource.data || dataFromSource;
    }
  };
};

/**
 * paginates sequelize model query
 *
 * @function
 *
 * @param {Function} dataSource - function to call as data source. must have a data attribute
 * @param {Function} handler - callback function
 *
 * @returns {void}
 */
export const batchQuery = async (dataSource, handler) => {
  await async.whilst(cb => cb(null, dataSource.data().length),
    async () => {
      await handler(dataSource.data());
      await dataSource.next();
    });
};

export const modelFieldsToLiteral = ({ alias, fields }) => (fields)
  .map(column => [Sequelize.literal(`${alias}."${column}"`), column]);
