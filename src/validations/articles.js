import { check } from 'express-validator/check';

export default {
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
  ]
};
