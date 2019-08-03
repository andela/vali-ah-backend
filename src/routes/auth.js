import express from 'express';

import authController from '../controllers/auth';
import validator from '../middlewares/validator';
import Schemas from '../validations/auth';
import asyncWrapper from '../middlewares/asyncWrapper';

const { signup, signin } = authController;
const { signupSchema, signinSchema } = Schemas;

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
router.post('/signup', validator(signupSchema), asyncWrapper(signup));

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
router.post('/signin', validator(signinSchema), asyncWrapper(signin));

export default router;
