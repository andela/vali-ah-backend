import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

import { ApplicationError } from '../helpers/errors';

/**
 * Generic schema validator
 *
 * @param {Array} schema
 * @param {number} status
 *
 * @returns {Array} array of validation schema and middleware
 */

export default (schemas, status = 400) => {
  const validationCheck = async (request, response, next) => {
    const errors = validationResult(request);
    request = { ...request, ...matchedData(request) };

    if (!errors.isEmpty()) {
      const mappedErrors = Object.entries(errors.mapped()).reduce((acc, [key, value]) => {
        acc[key] = value.msg;
        return acc;
      }, {});

      const appError = new ApplicationError(status, 'validation error', mappedErrors);

      return next(appError);
    }

    return next();
  };

  return [...(schemas.length && [schemas]), validationCheck];
};
