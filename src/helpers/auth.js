import database from '../models/index';

const { Users } = database;

/**
 * Returns user object or undefined
 *
 * @function
 *
 * @param {string} email - email of the user to be sort
 *
 * @returns {Object} - user or undefined
 */
export const getExistingUser = async (email) => {
  const user = await Users.findOne({
    where: {
      email
    }
  });
  return user;
};

export default { getExistingUser };
