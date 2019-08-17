import { check } from 'express-validator/check';

export default {
  createCommentSchema: [
    check('content')
      .trim()
      .exists()
      .withMessage('Comment content is required')
      .isLength({ min: 2, max: 256 })
      .withMessage('Comment content should be between 2 to 256 characters'),
    check('userId')
      .isUUID()
      .optional(),
    check('articleId')
      .isUUID()
      .withMessage('Article id not valid. should be of type uuid')
  ],
  getCommentSchema: [
    check('articleId')
      .isUUID()
      .withMessage('Article id not valid. should be of type uuid')
  ],
  voteCommentSchema: [
    check('commentId')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Comment id parameter is required')
      .isUUID()
      .withMessage('Comment id is not a valid uuid'),
    check('voteType')
      .trim()
      .exists()
      .withMessage('Vote type is required. e.g upVote, downVote or nullVote')
      .isIn(['upVote', 'downVote', 'nullVote'])
      .withMessage('Enter a valid vote type')
  ],
  createInlineCommentSchema: [
    check('articleId')
      .isUUID()
      .withMessage('Article id not valid. should be of type uuid'),
    check('startIndex')
      .exists()
      .withMessage('Highlight start index is required')
      .isInt()
      .withMessage('Highlight start index should be a number'),
    check('endIndex')
      .exists()
      .withMessage('Highlight end index is required')
      .isInt()
      .withMessage('Highlight end index should be a number'),
    check('content').trim()
      .exists().withMessage('Comment content is required')
      .isLength({ min: 2, max: 256 })
  ],
  updateInlineCommentSchema: [
    check('commentId')
      .isUUID()
      .withMessage('Comment id not valid. should be of type uuid'),
    check('startIndex')
      .isInt()
      .withMessage('Highlight start index should be a number'),
    check('endIndex')
      .isInt()
      .withMessage('Highlight end index should be a number'),
    check('content').trim()
      .isLength({ min: 2, max: 256 })
  ],
  inlineCommentSchema: [
    check('commentId')
      .isUUID()
      .withMessage('Comment id not valid. should be of type uuid')
  ]
};
