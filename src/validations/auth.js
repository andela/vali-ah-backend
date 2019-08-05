import { check } from 'express-validator/check';

export default {
  signupSchema: [
    check('firstName')
      .trim()
      .exists()
      .withMessage('first name is required')
      .isLength({ min: 2, max: 15 })
      .withMessage('first name should be between 2 to 15 characters')
      .isAlpha()
      .withMessage('first name should only contain alphabets')
      .customSanitizer(firstName => firstName.toLowerCase()),
    check('lastName')
      .trim()
      .exists()
      .withMessage('last name is required')
      .isLength({ min: 2, max: 15 })
      .withMessage('last name should be between 2 to 15 characters')
      .isAlpha()
      .withMessage('last name should only contain alphabets')
      .customSanitizer(lastName => lastName.toLowerCase()),
    check('userName')
      .trim()
      .exists()
      .withMessage('username is required')
      .isLength({ min: 2, max: 20 })
      .withMessage('username should be between 2 to 20 characters'),
    check('email')
      .trim()
      .exists()
      .withMessage('email address is required')
      .isEmail()
      .withMessage('enter a valid email address')
      .customSanitizer(email => email.toLowerCase()),
    check('password')
      .trim()
      .exists()
      .withMessage('password is required')
      .isLength({ min: 8, max: 15 })
      .withMessage('password should be between 8 to 15 characters')
  ],
  signinSchema: [
    check('email')
      .trim()
      .exists()
      .withMessage('email address is required')
      .isEmail()
      .withMessage('enter a valid email address')
      .customSanitizer(email => email.toLowerCase()),
    check('password')
      .trim()
      .exists()
      .withMessage('password is required')
      .isLength({ min: 8, max: 15 })
      .withMessage('password should be between 8 to 15 characters')
  ],
  socialLoginSchema: [
    check('provider')
      .trim()
      .exists()
      .withMessage('provider parameter is required')
      .isIn(['facebook', 'google'])
      .withMessage('enter a valid provider name'),
    check('accessToken')
      .trim()
      .exists()
      .withMessage('access token is required')
  ]
};
