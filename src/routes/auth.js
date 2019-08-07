import { Router } from 'express';
import passport from 'passport';

import authController from '../controllers/auth';
import authentication from '../middlewares/authentication';
import validator from '../middlewares/validator';
import Schemas from '../validations/auth';
import asyncWrapper from '../middlewares/asyncWrapper';

const {
  signup, signin, signout, socialLogin, twitterLogin
} = authController;
const { signupSchema, signinSchema, socialLoginSchema } = Schemas;

const router = Router();
const { verifyToken } = authentication;

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
 *         description: user successfully signs in
 */
router.post('/signin', validator(signinSchema), asyncWrapper(signin));

/**
 * @swagger
 *
 * /auth/signout:
 *   post:
 *     parameters:
 *       - in: header
 *         name: Authorization
 *     description: Signs out a user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User successfully signed out
 */
router.post('/signout', asyncWrapper(verifyToken), asyncWrapper(signout));

/**
 * @swagger
 *
 * /auth/twitter:
 *   get:
 *     description: Authenticate user using twitter
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 */
router.get('/twitter', passport.authenticate('twitter'));

/**
 * @swagger
 *
 * /auth/twitter/redirect:
 *   get:
 *     description: Create a new user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 */
router.get(
  '/twitter/redirect',
  passport.authenticate('twitter', { session: false }),
  asyncWrapper(twitterLogin)
);

/**
 * @swagger
 *
 * /auth/{provider}:
 *   post:
 *     description: Authenticate user using third party social account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Content-Type
 *         in: header
 *         required: true
 *         type: string
 *         default: application/json
 *       - name: provider
 *         in: path
 *         required: true
 *         type: string
 *       - name: accessToken
 *         description: User access token gotten from either facebook or google.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post('/:provider', validator(socialLoginSchema), asyncWrapper(socialLogin));

export default router;
