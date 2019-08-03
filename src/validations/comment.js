import { check } from 'express-validator/check';

const uuidRegularExpression = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

export default {
  createCommentSchema: [
    check('content').trim()
      .exists().withMessage('comment content is required')
      .isLength({ min: 2, max: 256 })
      .withMessage('comment content should be between 2 to 256 characters'),
    check('userId').matches(uuidRegularExpression).optional(),
    check('articleId')
      .matches(uuidRegularExpression)
      .withMessage('article id not valid. should be of type uuid')
  ]
};
