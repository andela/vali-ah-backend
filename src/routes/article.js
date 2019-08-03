import express from 'express';

import articleController from '../controllers/article';
import validator from '../middlewares/validator';
import commentSchema from '../validations/comment';
import asyncWrapper from '../middlewares/asyncWrapper';

const { createComment } = articleController;
const { createCommentSchema } = commentSchema;

const router = express.Router();

/**
 * @swagger
 *
 * /articles:
 *   post:
 *     description: Create comment for an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: article
 *         required: true
 *       - name: content
 *         description: content of the comment.
 *         in: body
 *         required: true
 *         type: string
 *       - name: userId
 *         description: The id of user posting the comment.
 *         in: body
 *         required: true
 *         type: string
 *       - name: repliedToId
 *         description: id of comment it is replying to if any.
 *         in: body
 *         type: string
 *     responses:
 *       201:
 *         description: comment posted
 */
router.post('/:articleId/comments', validator(createCommentSchema), asyncWrapper(createComment));

export default router;
