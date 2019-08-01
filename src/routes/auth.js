import express from 'express';
import { signup, signin } from '../controllers/auth';

const router = express.Router();


/**
 * @swagger
 *
 * /auth/signup:
 *   post:
 *     description: Signup to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userName
 *         description: Username to use for login.
 *         in: body
 *         required: true
 *         type: string
 *       - name: firstName
 *         description: first name of the user.
 *         in: body
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: last name of the user.
 *         in: body
 *         required: true
 *         type: string
 *       - name: email
 *         description: email of the user.
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: token is supplied
 */
router.post('/signup', signup);

/**
 * @swagger
 *
 * /auth/signin:
 *   post:
 *     description: Signs in a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: users
 */
router.post('/signin', signin);

export default router;
