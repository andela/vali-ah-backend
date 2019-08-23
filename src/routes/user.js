import express from 'express';
import profile from '../controllers/user';
import profileSchema from '../validations/profile';
import middlewares from '../middlewares';

const {
  getProfile,
  updateProfile,
  followAndUnfollow,
  getAllFollowers,
  getAllFollowings,
  createSubscriptions,
} = profile;
const {
  validator, asyncWrapper, verifyToken
} = middlewares;
const {
  profileUpdateSchema, profileViewSchema, followerSchema, subscriptions
} = profileSchema;
const router = express.Router();

/**
 * @swagger
 *
 * /profile/:id:
 *   patch:
 *     description: update user profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userName
 *         description: Username to update.
 *         in: body
 *         required: true
 *         type: string
 *       - name: firstName
 *         description: first name to update.
 *         in: body
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: last name to update.
 *         in: body
 *         required: true
 *         type: string
 *       - name: email
 *         description: email to update.
 *         in: body
 *         required: true
 *         type: string
 *       - name: avaterUrl
 *         description: image to update.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: updated successfully.
 *       400:
 *         description: not updated.
 */
router.patch(
  '/profile/:id',
  validator(profileUpdateSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(updateProfile)
);

/**
 * @swagger
 *
 * /profile/:id:
 *   get:
 *     description: get a user profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Username id.
 *         in: body
 *         required: true
 *         type: UUID
 *     responses:
 *       200:
 *         description: request was successful.
 *       404:
 *         description: user does not exist.
 */
router.get(
  '/profile/:id',
  validator(profileViewSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(getProfile)
);

/**
 * @swagger
 *
 * /profile/:userId/following:
 *   patch:
 *     description: following a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Users id.
 *         in: body
 *         required: true
 *         type: UUID
 *     responses:
 *       200:
 *         description: Successfully followed  or unfollowed a user
 *       404:
 *         description: User does not exist.
 *       409:
 *         description: User cannot perform this action.
 */
router.patch(
  '/profile/:userId/following',
  validator(followerSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(followAndUnfollow)
);

/**
 * @swagger
 *
 * /profile/:userId/followers:
 *   get:
 *     description: get all followers
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Username id.
 *         in: body
 *         required: true
 *         type: UUID
 *     responses:
 *       200:
 *         description: Request was successful.
 */
router.get(
  '/profile/:userId/followers/',
  validator(followerSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(getAllFollowers)
);

/**
 *
 * @swagger
 *
 * /profile/userId:/followings:
 *   get:
 *     description: get all followings
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Users id.
 *         in: body
 *         required: true
 *         type: UUID
 *     responses:
 *       200:
 *         description: Request was successful.
 */
router.get(
  '/profile/:userId/following/',
  validator(followerSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(getAllFollowings)
);

/**
 * @swagger
 *
 * /users/subscriptions:
 *   post:
 *     description: subscribe to categories
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
 *       - name: categories
 *         description: A stringified version of an array of categories
 *         in: body
 *         required: true
 *         schema:
 *             $ref: '#/definitions/subscription'
 *     responses:
 *       200:
 *         description: Success
 *     definitions:
 *         subscription:
 *           type: array
 *           items:
 *             type: string
 */
router.post(
  '/subscriptions',
  asyncWrapper(verifyToken),
  validator(subscriptions),
  asyncWrapper(createSubscriptions)
);

export default router;
