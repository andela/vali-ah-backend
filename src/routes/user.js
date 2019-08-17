import express from 'express';
import profile from '../controllers/user';
import profileSchema from '../validations/profileSchema';
import middlewares from '../middlewares';

const {
  viewProfile,
  updateProfile,
  followAndUnfollow,
  getAllFollowers,
  getAllFollowings,
} = profile;
const {
  validator, emptybody, asyncWrapper, verifyToken
} = middlewares;
const { profileUpdateSchema, profileViewSchema, followerSchema } = profileSchema;
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
  emptybody,
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
router.get('/profile/:id', validator(profileViewSchema), asyncWrapper(verifyToken), asyncWrapper(viewProfile));

/**
 * @swagger
 *
 * /profile/:userId/following:
 *   post:
 *     description: follower a user
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
 *         description: Successfully followed a user
 *       404:
 *         description: User does not exist.
 *       409:
 *         description: User cannot perform this action.
 */
router.patch(
  '/profile/:userId/following/',
  validator(followerSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(followAndUnfollow)
);

/**
 * @swagger
 *
 * /profile/:userId/followers:
 *   get:
 *     description: get allfollowers
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
  '/profile/:userId/followings/',
  validator(followerSchema),
  asyncWrapper(verifyToken),
  asyncWrapper(getAllFollowings)
);

export default router;
