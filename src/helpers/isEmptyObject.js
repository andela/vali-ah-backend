/**
 * Validator to check if an object is empty
 *
 * @function
 *
 * @param {Object} object to validate
 *
 * @returns {boolean} true or false
 */
export default object => (Object.keys(object).length === 0);
