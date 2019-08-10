import { check } from 'express-validator/check';

export default {
  voteSchema: [
    check('articleId')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Article id parameter is required')
      .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      .withMessage('Article id is not a valid uuid'),
    check('voteType')
      .trim()
      .exists()
      .withMessage('Vote type is required. e.g upVote, downVote or nullVote')
      .isIn(['upVote', 'downVote', 'nullVote'])
      .withMessage('Enter a valid vote type')
  ]
};
