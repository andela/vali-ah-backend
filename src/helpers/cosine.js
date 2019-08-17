const vecDotProduct = (vectorA, vectorB) => {
  const product = vectorA.reduce((acc, vec, i) => {
    acc += vec * vectorB[i];
    return acc;
  }, 0);

  return product;
};

const vecMagnitude = (vector) => {
  const sum = vector.reduce((acc, vec) => {
    acc += vec * vec;
    return acc;
  }, 0);

  return Math.sqrt(sum);
};

const cosineSimilarity = (vectorA, vectorB) => (vecDotProduct(vectorA, vectorB)
/ (vecMagnitude(vectorA) * vecMagnitude(vectorB)));

const wordOccurenceInString = (string, listOfWords) => listOfWords
  .map(word => (string.match(new RegExp(word, 'g')) || []).length);

/**
 * compares two strings using cosine similarity
 *
 * @function
 *
 * @param {Function} stringOne
 * @param {Object} stringTwo
 *
 * @return {number} - sequelize object for inserted data
 */
export default (stringOne, stringTwo) => {
  const words = Array.from(new Set([...stringOne.split(' '), ...stringTwo.split(' ')]));
  const stringOneVector = wordOccurenceInString(stringOne, words);
  const stringTwoVector = wordOccurenceInString(stringTwo, words);

  const similarity = cosineSimilarity(stringOneVector, stringTwoVector);

  return parseFloat(similarity.toFixed(2));
};
