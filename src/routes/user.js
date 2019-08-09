import express from 'express';
import profile from '../controllers/user';
import profileSchema from '../validations/profileSchema';
import middlewares from '../middlewares';

const { viewProfile, updateProfile } = profile;
const {
  validator, emptybody, asyncWrapper, verifyToken
} = middlewares;
const { profileUpdateSchema, profileViewSchema } = profileSchema;
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

export default router;