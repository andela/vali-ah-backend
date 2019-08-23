import { check } from 'express-validator/check';

export default {
  paginatorSchema: [
    check('page')
      .optional()
      .trim()
      .isInt()
      .withMessage('Page must be a number'),
    check('limit')
      .optional()
      .trim()
      .isNumeric()
      .withMessage('Limit must be a number')
  ]
};
