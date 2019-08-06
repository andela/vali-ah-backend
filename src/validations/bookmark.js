import { check } from 'express-validator/check';

const uuidRegularExpression = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

export default {
  createBookmarkSchema: [
    check('userId').matches(uuidRegularExpression).optional(),
    check('articleId')
      .matches(uuidRegularExpression)
      .withMessage('article id not valid. should be of type uuid')
  ]
};
