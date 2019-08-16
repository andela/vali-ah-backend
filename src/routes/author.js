import express from 'express';
import authors from '../controllers/author';
import middlewares from '../middlewares';

const { asyncWrapper, verifyToken } = middlewares;
const { getAllAuthors } = authors;
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
router.get('/', asyncWrapper(verifyToken), asyncWrapper(getAllAuthors));

export default router;
