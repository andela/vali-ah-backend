import { check } from 'express-validator/check';

const regEx = /^(draft|public)$/;

export default {
  articleCreateSchema: [
    check('summary')
      .isLength({ min: 5, max: 20 })
      .withMessage('summary should be between 5 to 20 characters'),
    check('body')
      .trim()
      .exists()
      .withMessage('article body is required')
      .isLength({ min: 50, max: 1024 })
      .withMessage('article body should be between 50 to 1024 characters'),
    check('title')
      .exists()
      .trim()
      .withMessage('title is required')
      .isLength({ min: 5, max: 50 })
      .withMessage('article title should be between 5 to 20 characters'),
    check('followUpId')
      .optional()
      .trim()
      .isUUID()
      .withMessage('followUpId must be of type uuid'),
    check('tag')
      .optional()
      .isArray()
      .withMessage('tag must be an array'),
    check('suspended')
      .optional()
      .isBoolean()
      .withMessage('suspended must be a boolean'),
    check('status')
      .optional()
      .matches(regEx)
      .withMessage('status must be either "draft" or "public"'),
  ]
};
