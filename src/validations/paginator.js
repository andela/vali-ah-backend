import { check } from 'express-validator/check';

export default {
  paginatorSchema: [
    check('page')
      .optional()
      .trim()
      .toInt()
      .isInt()
      .withMessage('Page must be a number'),
    check('limit')
      .optional()
      .trim()
      .toInt()
      .isInt()
      .withMessage('Limit must be a number')
  ]
};
