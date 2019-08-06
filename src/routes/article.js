import express from 'express';

import articleController from '../controllers/article';
import authentication from '../middlewares/authentication';
import validator from '../middlewares/validator';
import commentSchema from '../validations/comment';
import paginationSchema from '../validations/pagination';
import asyncWrapper from '../middlewares/asyncWrapper';
import bookmarkSchema from '../validations/bookmark';

const {
  createComment, createBookmark, removeBookmark, searchArticles
} = articleController;
const { createCommentSchema } = commentSchema;
const { verifyToken } = authentication;
const { createPaginationSchema } = paginationSchema;
const { createBookmarkSchema } = bookmarkSchema;

const router = express.Router();

router.use(asyncWrapper(verifyToken));

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

/**
 * @swagger
 *
 * /bookmarks:
 *   post:
 *     description: Bookmark an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *       - name: userId
 *         description: The id of user posting the comment.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: article added to bookmark
 */
router.post('/:articleId/bookmarks/', validator(createBookmarkSchema), asyncWrapper(createBookmark));

/**
 * @swagger
 *
 * /bookmarks:
 *   delete:
 *     description: Remove an article from bookmark
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *       - name: userId
 *         description: The id of user posting the comment.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       20:
 *         description: article removed from bookmark
 */
router.delete('/:articleId/bookmarks/', validator(createBookmarkSchema), asyncWrapper(removeBookmark));

router.get('', validator(createPaginationSchema), asyncWrapper(searchArticles));

export default router;
