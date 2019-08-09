import { check } from 'express-validator/check';
import makeCapitalize from '../helpers/makeCapitalize';

const profileSchemas = {
  profileUpdateSchema: [
    check('userName')
      .optional()
      .trim()
      .exists()
      .withMessage('User name is required')
      .isLength({ min: 2, max: 20 })
      .withMessage('User name should be between 2 to 20 characters')
      .customSanitizer(value => makeCapitalize(value)),
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
      .customSanitizer(value => makeCapitalize(value)),
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
      .customSanitizer(value => makeCapitalize(value)),
    check('email')
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Email cannot be blank')
      .isEmail()
      .withMessage('Email is not valid')
      .customSanitizer(value => value.toLowerCase()),
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
      .withMessage('Invalid id')
  ],
  profileViewSchema: [
    check('id')
      .trim()
      .isUUID()
      .withMessage('Invalid id')
  ]
};

export default profileSchemas;
