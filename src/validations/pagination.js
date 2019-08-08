import { check } from 'express-validator/check';

export default {
  createPaginationSchema: [
    check('page')
      .optional()
      .trim()
      .isInt()
      .withMessage('Page must be a number')
      .customSanitizer(page => page.toLowerCase()),
    check('limit')
      .optional()
      .trim()
      .isNumeric()
      .withMessage('Limit must be a number')
      .customSanitizer(page => page.toLowerCase())
  ]
};
