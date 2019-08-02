import { check } from 'express-validator/check';

export default {
  signupSchema: [
    check('firstName')
      .trim()
      .isLength({ min: 2, max: 15 })
      .withMessage('First name should be between 2 to 15 characters')
      .isAlpha()
      .withMessage('First name should only contain alphabets')
      .customSanitizer(firstName => firstName.toLowerCase()),
    check('lastName')
      .trim()
      .isLength({ min: 2, max: 15 })
      .withMessage('Last name should be between 2 to 15 characters')
      .isAlpha()
      .withMessage('Last name should only contain alphabets')
      .customSanitizer(lastName => lastName.toLowerCase()),
    check('userName')
      .trim()
      .isLength({ min: 2, max: 20 })
      .withMessage('Username should be between 2 to 20 characters'),
    check('email')
      .trim()
      .isEmail()
      .withMessage('Enter a valid email address')
      .customSanitizer(email => email.toLowerCase()),
    check('password')
      .trim()
      .isLength({ min: 8, max: 15 })
      .withMessage('Password should be between 8 to 15 characters')
      .matches(/[aA-zZ]+[0-9]+/)
      .withMessage('Password must be alphanumeric characters')
  ]
};
