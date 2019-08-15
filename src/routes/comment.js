import { Router } from 'express';

import commentController from '../controllers/comment';
import commentSchema from '../validations/comment';
import asyncWrapper from '../middlewares/asyncWrapper';
import validator from '../middlewares/validator';
import authentication from '../middlewares/authentication';

const { voteComment } = commentController;
const { voteCommentSchema } = commentSchema;
const { verifyToken } = authentication;

const router = Router();

/**
 * @swagger
 *
 * /comments/{commentId}/vote:
 *   post:
 *     description: up vote or down vote a comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         default: Bearer {token}
 *       - name: Content-Type
 *         in: header
 *         required: true
 *         type: string
 *         default: application/json
 *       - name: commentId
 *         in: path
 *         required: true
 *         type: string
 *       - name: voteType
 *         description: Vote type. i.e upVote, downVote or nullVote
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post(
  '/:commentId/vote',
  asyncWrapper(verifyToken),
  validator(voteCommentSchema),
  asyncWrapper(voteComment)
);

export default router;
