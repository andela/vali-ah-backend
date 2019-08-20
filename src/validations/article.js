import { check } from 'express-validator/check';

const statusRegEx = /^(draft|published)$/;
const uuidRegularExpression = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

export default {
  createArticleSchema: [
    check('summary')
      .isLength({ min: 5, max: 20 })
      .withMessage('Summary should be between 5 to 20 characters'),
    check('body')
      .trim()
      .exists()
      .withMessage('Article body is required')
      .isLength({ min: 50, max: 1024 })
      .withMessage('Article body should be between 50 to 1024 characters'),
    check('title')
      .exists()
      .trim()
      .withMessage('Title is required')
      .isLength({ min: 5, max: 50 })
      .withMessage('Article title should be between 5 to 20 characters'),
    check('followUpId')
      .optional()
      .trim()
      .isUUID()
      .withMessage('FollowUpId must be of type uuid'),
    check('tag')
      .optional()
      .isArray()
      .withMessage('Tag must be an array'),
    check('suspended')
      .optional()
      .isBoolean()
      .withMessage('Suspended must be a boolean'),
    check('status')
      .optional()
      .matches(statusRegEx)
      .withMessage('Status must be either "draft" or "published"'),
  ],
  searchSchema: [
    check('title')
      .optional()
      .trim(),
    check('tag')
      .optional()
      .trim()
      .isAlpha()
      .withMessage('Tag can only be alphabets'),
    check('author')
      .optional()
      .trim()
      .withMessage('Author can only be alphabets'),
    check('keyword')
      .optional()
      .trim()
      .withMessage('Keyword can only be alphabets'),
    check('includeSubscriptions')
      .optional()
      .trim()
      .isBoolean()
      .withMessage('includeSubscriptions can only be true or false'),
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
  ],
  voteSchema: [
    check('articleId')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Article id parameter is required')
      .isUUID()
      .withMessage('Article id is not a valid uuid'),
    check('voteType')
      .trim()
      .exists()
      .withMessage('Vote type is required. e.g upVote, downVote or nullVote')
      .isIn(['upVote', 'downVote', 'nullVote'])
      .withMessage('Enter a valid vote type')
  ],
  articlePathSchema: [
    check('articleId')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Article id parameter is required')
      .matches(uuidRegularExpression)
  ]
};
