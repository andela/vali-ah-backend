/**
 * Generic to lower case
 *
 * @function
 *
 * @param {string} word
 *
 * @returns {Function} call to turn upper case to lower case
 */
const makeCapitalize = (word) => {
  const formattedWord = word
    .toLowerCase()
    .split(' ')
    .map(f => f.charAt(0).toUpperCase() + f.substring(1))
    .join(' ');

  return formattedWord;
};

export default makeCapitalize;
