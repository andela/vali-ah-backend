import express from 'express';

import articleSchema from '../validations/article';
import articleValidator from '../middlewares/articles';
import upload from '../services/imageUpload';
import articleController from '../controllers/article';
import authentication from '../middlewares/authentication';
import validator from '../middlewares/validator';
import commentSchema from '../validations/comment';
import asyncWrapper from '../middlewares/asyncWrapper';
import bookmarkSchema from '../validations/bookmark';

const {
  createComment,
  createBookmark,
  removeBookmark,
  searchArticle,
  voteArticle,
  getComments,
  createArticle,
  getBySlug,
  updateArticle,
  deleteArticle,
  createInlineComment,
  updateInlineComment,
  deleteInlineComment,
  getInlineComment,
  getArticleInlineComment,
  getUserFeed,
  getSubscribedArticles,
  getAllBookmark
} = articleController;
const {
  createCommentSchema,
  getCommentSchema,
  createInlineCommentSchema,
  updateInlineCommentSchema,
  inlineCommentSchema
} = commentSchema;
const { verifyToken, isAuthor, ownComment } = authentication;
const { createBookmarkSchema } = bookmarkSchema;
const { checkArticle, checkArticleUpdate } = articleValidator;

const {
  createArticleSchema, voteSchema, articlePathSchema, searchSchema,
  updateArticleSchema
} = articleSchema;

const router = express.Router();

/**
 * @swagger
 *
 * /articles/:articleId/comments:
 *   post:
 *     description: Create comment for an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         default: Bearer {token}
 *       - in: path
 *         name: articleId
 *         required: true
 *       - name: content
 *         description: content of the comment.
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
router.post(
  '/:articleId/comments',
  validator(createCommentSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(createComment)
);

/**
 * @swagger
 *
 * /articles/feed:
 *   get:
 *     description: get paginated followed aticles
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 */
router.get('/feed', asyncWrapper(verifyToken), asyncWrapper(getUserFeed));


/**
 * @swagger
 *
 * /articles/bookmarks:
 *   get:
 *     description: Get all bookmarked articles
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/bookmarks',
  asyncWrapper(verifyToken),
  asyncWrapper(getAllBookmark)
);

/**
 * @swagger
 *
 * /articles/bookmarks:
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
router.post(
  '/:articleId/bookmarks/',
  validator(createBookmarkSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(createBookmark)
);

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
 *       200:
 *         description: article removed from bookmark
 */
router.delete(
  '/:articleId/bookmarks/',
  validator(createBookmarkSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(removeBookmark)
);

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
 *         in: query
 *         required: true
 *         type: string
 *       - name: title
 *         description: content of the articles.
 *         in: query
 *         required: true
 *         type: string
 *       - name: author
 *         description: associate of the articles model.
 *         in: query
 *         type: string
 *       - name: includeSubscriptions
 *         description: boolean to include articles in categories user is subscribed to
 *         in: query
 *         type: boolean
 *       - name: keyword
 *         description: a search query for articles.
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: request successful
 *       400:
 *         description: keyword cannot be used with title, author or tag
 */
router.get('/', validator(searchSchema), asyncWrapper(searchArticle));
router.get('/', asyncWrapper(verifyToken), asyncWrapper(getSubscribedArticles));

/**
 * @swagger
 *
 * /articles/{articleId}/vote:
 *   post:
 *     description: up vote or down vote an article
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
 *       - name: articleId
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
  '/:articleId/vote',
  asyncWrapper(verifyToken),
  validator(voteSchema),
  asyncWrapper(voteArticle)
);

/**
 * @swagger
 *
 * /articles/:articleId/comments:
 *   get:
 *     description: Get comments for an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: articleId
 *         description: articleId is the unique identifier for the article to get the comments
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 */
router.get(
  '/:articleId/comments',
  validator(getCommentSchema),
  asyncWrapper(getComments)
);

/**
 * @swagger
 *
 * /articles/:
 *   post:
 *     description: Create article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: summary
 *         description: summary of article.
 *         in: body
 *         required: false
 *         type: string
 *       - name: body
 *         description: body of the article.
 *         in: body
 *         required: true
 *         type: string
 *       - name: suspended
 *         description: boolean to show if article is suspended or not.
 *         in: body
 *         type: boolean
 *         required: false
 *       - name: title
 *         description: title of the article.
 *         in: body
 *         type: string
 *         required: false
 *       - name: tag
 *         description: array of uuid's representing article categories.
 *         in: body
 *         type: array
 *         required: false
 *       - name: status
 *         description: tells if the article is published or drafted
 *         in: body
 *         type: string
 *         required: false
 *     responses:
 *       201:
 *         description: article created
 */
router.post(
  '/',
  upload.single('image'),
  validator(createArticleSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(checkArticle),
  asyncWrapper(createArticle)
);

/**
 * @swagger
 *
 * /articles/{slug}:
 *   get:
 *     description: Create a new user
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: path
 *          name: slug
 *          required: true
 *     responses:
 *       200:
 *         description: success
 */
router.get('/:slug', asyncWrapper(getBySlug));

/**
 * @swagger
 *
 * /articles/{slug}:
 *   put:
 *     description: Updates an existing article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: summary
 *         description: summary of article.
 *         in: body
 *         required: false
 *         type: string
 *       - name: body
 *         description: body of the article.
 *         in: body
 *         required: true
 *         type: string
 *       - name: suspended
 *         description: boolean to show if article is suspended or not.
 *         in: body
 *         type: boolean
 *         required: false
 *       - name: title
 *         description: title of the article.
 *         in: body
 *         type: string
 *         required: false
 *       - name: tag
 *         description: array of uuid's representing article categories.
 *         in: body
 *         type: array
 *         required: false
 *       - name: status
 *         description: tells if the article is published or drafted
 *         in: body
 *         type: string
 *         required: false
 *       - in: path
 *         name: slug
 *         required: true
 *     responses:
 *       200:
 *         description: success
 */
router.put(
  '/:slug',
  upload.single('image'),
  validator(updateArticleSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(isAuthor),
  asyncWrapper(checkArticleUpdate),
  asyncWrapper(updateArticle)
);

/**
 * @swagger
 *
 * /articles/{slug}:
 *   delete:
 *     description: deletes an article by slug
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: path
 *          name: slug
 *          required: true
 *     responses:
 *       200:
 *         description: successful delete
 */
router.delete(
  '/:slug',
  asyncWrapper(verifyToken),
  asyncWrapper(isAuthor),
  asyncWrapper(deleteArticle)
);

/**
 * @swagger
 *
 * /articles/:articleId/inline_comments:
 *   post:
 *     description: Create an inline comment for an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         default: Bearer {token}
 *       - in: path
 *         name: articleId
 *         required: true
 *       - name: content
 *         description: content of the comment.
 *         in: body
 *         required: true
 *         type: string
 *       - name: startIndex
 *         description: start index of highlight.
 *         in: body
 *         type: number
 *         required: true
 *       - name: endIndex
 *         description: end index of highlight
 *         in: body
 *         type: number
 *         required: true
 *     responses:
 *       201:
 *         description: comment successfully created
 */
router.post(
  '/:articleId/inline_comments',
  validator(createInlineCommentSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(createInlineComment)
);

/**
 * @swagger
 *
 * /articles/:articleId/inline_comments:
 *   get:
 *     description: Queries inline comments for an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *     responses:
 *       201:
 *         description: comments successfully retrieved
 */
router.get(
  '/:articleId/inline_comments',
  validator(articlePathSchema),
  asyncWrapper(getArticleInlineComment)
);

/**
 * @swagger
 *
 * /articles/inline_comments/commentId:
 *   put:
 *     description: Edit an inline comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         default: Bearer {token}
 *       - in: path
 *         name: commentId
 *         required: true
 *       - name: content
 *         description: content of the comment.
 *         in: body
 *         required: true
 *         type: string
 *       - name: startIndex
 *         description: start index of highlight.
 *         in: body
 *         type: number
 *       - name: endIndex
 *         description: end index of highlight
 *         in: body
 *         type: number
 *     responses:
 *       201:
 *         description: comment updated
 */
router.put(
  '/inline_comments/:commentId',
  validator(updateInlineCommentSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(ownComment),
  asyncWrapper(updateInlineComment)
);

/**
 * @swagger
 *
 * /articles/inline_comments/commentId:
 *   delete:
 *     description: Create comment for an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         default: Bearer {token}
 *       - in: path
 *         name: commentId
 *         required: true
 *     responses:
 *       201:
 *         description: comment posted
 */
router.delete(
  '/inline_comments/:commentId',
  validator(inlineCommentSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(ownComment),
  asyncWrapper(deleteInlineComment)
);

/**
 * @swagger
 *
 * /articles/inline_comments/commentId:
 *   get:
 *     description: Queries a single inline comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *     responses:
 *       201:
 *         description: Query successfull
 */
router.get(
  '/inline_comments/:commentId',
  validator(inlineCommentSchema),
  asyncWrapper(getInlineComment)
);

export default router;
