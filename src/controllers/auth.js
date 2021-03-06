import dotenv from 'dotenv';

import database from '../models';
import { NotFoundError, ApplicationError } from '../helpers/errors';
import { generateAuthToken } from '../helpers/auth';
import notification from '../services/notification';
import { facebookAuth, googleAuth, createOrFindUser } from '../services/auth';

dotenv.config();

const { Users, BlacklistedTokens } = database;

export default {
  /**
   * Handles user signup.
   *
   * @param {Object} request - the request object to the server
   * @param {Object} response - express response object
   *
   * @returns {Object} - response object
   */
  signup: async (request, response) => {
    const existingUser = await Users.getExistingUser(request.body.email);
    const existingUserName = await Users.getExistingUser(request.body.userName, 'userName');

    if (existingUser) throw new ApplicationError(409, 'You are already registered');
    if (existingUserName) throw new ApplicationError(409, 'UserName already in use');

    const newUser = await Users.create(request.body);

    const { email, firstName } = newUser;
    const { password, ...createdUser } = newUser.dataValues;
    const host = request.get('host');
    const token = generateAuthToken(newUser);

    notification.emit('notification', {
      type: 'accountActivation',
      payload: [{
        email,
        firstName,
        verificationLink: `https://${host}/profile`
      }]
    });

    return response.status(201).json({ status: 'success', data: { user: createdUser, token } });
  },

  /**
   * Handles user signin
   *
   * @param {Object} request - the request object to the server
   * @param {Object} response - express response object
   *
   *  @returns {Object} - response object
   */
  signin: async (request, response) => {
    const { password, email } = request.body;
    const user = await Users.getExistingUser(email);

    if (!user) throw new NotFoundError('You are not yet registered');

    const isRealPassword = await Users.comparePassword(password, user.password);

    if (!isRealPassword) throw new ApplicationError(400, 'Invalid user name or password');

    delete user?.dataValues?.password;

    const token = generateAuthToken(user);

    return response.status(200).json({ status: 'success', data: { user, token }, message: 'User signed in successfully' });
  },

  /**
   * Handles user signout
   *
   * @param {Object} request - The request object to the server
   * @param {Object} response - express response object
   *
   * @returns {Object} - response object
   */
  signout: async (request, response) => {
    const authHeader = request.headers.authorization;
    const token = authHeader.split(' ')[1];
    const { id } = request.user;

    await BlacklistedTokens.create({ token, userId: id });

    return response.status(200).json({ status: 'success', message: 'User logged out successfully' });
  },

  /**
   * Handles user sign up and sign in using their social media accounts
   *
   * - Facebook login
   * - Google login
   *
   * @function
   *
   * @param {Object} request - the request object to the server
   * @param {Object} response - express response object
   *
   * @returns {Object} - response object
   */
  socialLogin: async (request, response) => {
    const { provider } = request.params;
    const providerHandle = {
      facebook: facebookAuth,
      google: googleAuth
    };
    const userDetails = await providerHandle[provider](request.body);
    const { status, data } = await createOrFindUser(userDetails);

    return response.status(status).json({ status: 'success', data });
  },

  /**
   * Handles user sign in using their twitter credentials
   *
   * @function
   *
   * @param {Object} request object
   * @param {Object} response - express response object
   *
   * @returns {Object} response object
   */
  twitterLogin: async (request, response) => {
    const { status, data } = await createOrFindUser(request.user);

    return response.status(status).json({ status: 'success', data });
  },

  /**
   * Handles user reset password
   *
   * @function
   * @param {Object} request - request object to the server
   * @param {Object} response - response object from the server
   *
   * @returns {Object} - password reset link
   */
  resetPassword: async (request, response) => {
    const { email } = request.body;

    const user = await Users.getExistingUser(email);

    if (!user) throw new NotFoundError();

    const token = await user.generateVerificationToken();

    const resetLink = `${process.env.FRONT_END_APP_URL}/password-reset/${user.id}?token=${token}`;

    notification.emit('notification', {
      type: 'passwordRecovery',
      payload: [{
        email,
        resetLink,
      }]
    });

    return response.status(200).json({ status: 'success', data: { resetLink }, message: 'Email sent successfully' });
  },

  /**
   * Handles user update password
   *
   * @function
   * @param {Object} request - The request object to the server
   * @param {Object} response - The response object from the server
   *
   * @returns {void} - no data returned
   */
  updatePassword: async (request, response) => {
    const { id, token } = request.params;
    const { password } = request.body;

    const user = await Users.findByPk(id);

    if (!user) throw new NotFoundError();

    await user.decodeVerificationToken(token);

    await user.update({ password });

    notification.emit('notification', {
      type: 'passwordUpdateSuccessful',
      payload: [{
        email: user.email,
      }]
    });

    return response.status(200).json({ status: 'success', message: 'Password updated successfully' });
  }
};
