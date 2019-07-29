import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

/**
 * Generic schema validator
 *
 * @param {Array} schema
 * @param {number} status
 *
 * @returns {Array} array of validation schema and middleware
 */

export default (schemas, status = 400) => {
  const schemaToValidate = schemas || [];

  const validationCheck = async (request, response, next) => {
    const errors = validationResult(request);
    request = { ...request, ...matchedData(request) };

    if (!errors.isEmpty()) {
      const mappedErrors = errors.mapped();

      return response.status(status).json({
        status: 'error',
        error: mappedErrors
      });
    }

    return next();
  };

  return [schemaToValidate, validationCheck];
};
