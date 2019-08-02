import { check } from 'express-validator/check';

const uuidRegularExpression = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

export default {
  createCommentSchema: [
    check('content').trim().isLength({ min: 2 }).withMessage('comment content is required'),
    check('userId').matches(uuidRegularExpression).optional(),
    check('article').matches(uuidRegularExpression).withMessage('article id not valid. should be of type uuid')
  ]
};
