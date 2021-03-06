import { check } from 'express-validator/check';
import validateSubscriptions from '../helpers/subscription';

const profileSchemas = {
  profileUpdateSchema: [
    check('userName')
      .optional()
      .trim()
      .exists()
      .withMessage('User name is required')
      .isLength({ min: 2, max: 20 })
      .withMessage('User name should be between 2 to 20 characters')
      .customSanitizer(userName => userName.toLowerCase()),
    check('firstName')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('First name cannot be blank')
      .isLength({ min: 2, max: 15 })
      .withMessage('First name should be between 2 to 15 characters')
      .isAlpha()
      .withMessage('First name should only contain alphabets')
      .customSanitizer(firstName => firstName.toLowerCase()),
    check('lastName')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Last name cannot be blank')
      .isLength({ min: 2, max: 15 })
      .withMessage('Last name should be between 2 to 15 characters')
      .isAlpha()
      .withMessage('Last name should only contain alphabets')
      .customSanitizer(lastName => lastName.toLowerCase()),
    check('email')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Email cannot be blank')
      .isEmail()
      .withMessage('Email is not valid')
      .customSanitizer(email => email.toLowerCase()),
    check('bio')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Bio cannot be blank'),
    check('notify')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .isBoolean()
      .withMessage('notify cannot be blank and should be a boolean'),
    check('avatarUrl')
      .optional()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('AvatarUrl cannot be blank')
      .isURL()
      .withMessage('AvatarUrl must be a valid URL string'),
    check('id')
      .trim()
      .isUUID()
      .withMessage('Id does not exist'),
  ],
  profileViewSchema: [
    check('id')
      .trim()
      .isUUID()
      .withMessage('Id does not exist'),
  ],
  followerSchema: [
    check('userId')
      .trim()
      .isUUID()
      .withMessage('Id does not exist'),
  ],
  subscriptions: [
    check('categories')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Categories cannot be empty')
      .isArray()
      .withMessage('Categories should be an array')
      .custom(value => validateSubscriptions(value)),
  ],
};

export default profileSchemas;
