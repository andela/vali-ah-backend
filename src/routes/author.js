import express from 'express';
import AuthorController from '../controllers/author';
import middlewares from '../middlewares';
import paginatorSchema from '../validations/paginator';

const { asyncWrapper, verifyToken, validator } = middlewares;
const { getAllAuthors } = AuthorController;
const { paginatorSchema: pageLimitSchema } = paginatorSchema;
const router = express.Router();

/**
 * @swagger
 *
 * /authors:
 *   get:
 *     description: get a list of all authors
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: authors found
 *       404:
 *         description: authors not found
 */
router.get('/', asyncWrapper(verifyToken), validator(pageLimitSchema), asyncWrapper(getAllAuthors));

export default router;
