import { check } from 'express-validator/check';

export default {
  signupSchema: [
    check('firstName')
      .trim()
      .exists()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 15 })
      .withMessage('First name should be between 2 to 15 characters')
      .isAlpha()
      .withMessage('First name should only contain alphabets')
      .customSanitizer(firstName => firstName.toLowerCase()),
    check('lastName')
      .trim()
      .exists()
      .withMessage('Last name is required')
      .isLength({ min: 2, max: 15 })
      .withMessage('Last name should be between 2 to 15 characters')
      .isAlpha()
      .withMessage('Last name should only contain alphabets')
      .customSanitizer(lastName => lastName.toLowerCase()),
    check('userName')
      .trim()
      .exists()
      .withMessage('Username is required')
      .isLength({ min: 2, max: 20 })
      .withMessage('Username should be between 2 to 20 characters'),
    check('email')
      .trim()
      .exists()
      .withMessage('Email address is required')
      .isEmail()
      .withMessage('Enter a valid email address')
      .customSanitizer(email => email.toLowerCase()),
    check('password')
      .trim()
      .exists()
      .withMessage('Password is required')
      .isLength({ min: 8, max: 15 })
      .withMessage('Password should be between 8 to 15 characters')
  ],
  signinSchema: [
    check('email')
      .trim()
      .exists()
      .withMessage('Email address is required')
      .isEmail()
      .withMessage('Enter a valid email address')
      .customSanitizer(email => email.toLowerCase()),
    check('password')
      .trim()
      .exists()
      .withMessage('Password is required')
      .isLength({ min: 8, max: 15 })
      .withMessage('Password should be between 8 to 15 characters')
  ],
  socialLoginSchema: [
    check('provider')
      .trim()
      .exists()
      .withMessage('Provider parameter is required')
      .isIn(['facebook', 'google'])
      .withMessage('Enter a valid provider name'),
    check('accessToken')
      .trim()
      .exists()
      .withMessage('Access token is required')
  ]
};
