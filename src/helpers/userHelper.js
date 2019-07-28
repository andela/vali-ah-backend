import database from '../models/index';

const { Users } = database;
/**
 * Returns true if email is in the database
 *
 * @param {String} email - email of the user to be sort
 *
 * @returns {Boolean} - returns a true if user is found
 */
const doesUserExist = async (email) => {
  const userToBeCreated = await Users.findOne({
    where: {
      email
    }
  });
  return userToBeCreated !== null;
};

export default doesUserExist;
