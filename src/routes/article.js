import express from 'express';

import articleController from '../controllers/article';
import authentication from '../middlewares/authentication';
import validator from '../middlewares/validator';
import commentSchema from '../validations/comment';
import searchSchema from '../validations/auth';
import asyncWrapper from '../middlewares/asyncWrapper';
import bookmarkSchema from '../validations/bookmark';

const {
  createComment, createBookmark, removeBookmark, searchArticle
} = articleController;
const { createCommentSchema } = commentSchema;
const { createSearchSchema } = searchSchema;
const { verifyToken } = authentication;
const { createBookmarkSchema } = bookmarkSchema;

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
router.post('/:articleId/comments', validator(createCommentSchema), asyncWrapper(verifyToken), asyncWrapper(createComment));

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
router.post('/:articleId/bookmarks/', validator(createBookmarkSchema), asyncWrapper(verifyToken), asyncWrapper(createBookmark));

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
router.delete('/:articleId/bookmarks/', validator(createBookmarkSchema), asyncWrapper(verifyToken), asyncWrapper(removeBookmark));

/**
 * @swagger
 *
 * /articles:
 *   get:
 *     description: Search for an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: SearchArticles
 *         required: true
 *       - name: tag
 *         description: content of the articles.
 *         in: body
 *         required: true
 *         type: string
 *       - name: title
 *         description: content of the articles.
 *         in: body
 *         required: true
 *         type: string
 *       - name: author
 *         description: associate of the articles model.
 *         in: body
 *         type: string
 *       - name: keyword
 *         description: a search query for articles.
 *         in: body
 *         type: string
 *     responses:
 *       200:
 *         description: request successful
 *       400:
 *         description: keyword cannot be used with title, author or tag
 */
router.get('', validator(createSearchSchema), asyncWrapper(searchArticle));

export default router;
