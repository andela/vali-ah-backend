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
   * @return {Object} - response object
   */
  signup: async (request, response) => {
    const existingUser = await Users.getExistingUser(request.body.email);

    if (existingUser) throw new ApplicationError(409, 'You are already registered');

    const newUser = await Users.create(request.body);

    const { email, firstName } = newUser;
    const host = request.get('host');
    const token = generateAuthToken(newUser);

    notification.emit('notification', {
      type: 'accountActivation',
      payload: [
        {
          email,
          firstName,
          verificationLink: `https://${host}/profile`
        }
      ]
    });

    return response.status(201).json({ status: 'success', data: { user: newUser, token } });
  },

  /**
   * Handles user signin
   *
   * @param {Object} request - the request object to the server
   * @param {Object} response - express response object
   *
   * @return {Object} - response object
   */
  signin: async (request, response) => {
    const { password, email } = request.body;
    const user = await Users.getExistingUser(email);

    if (!user) throw new NotFoundError('You are not yet registered');

    const isRealPassword = await Users.comparePassword(password, user.password);

    if (!isRealPassword) throw new ApplicationError(400, 'Invalid user name or password');

    delete user?.dataValues?.password;

    const token = generateAuthToken(user);

    return response.status(200).json({ status: 'success', data: { user, token } });
  },

  /**
   * Handles user signout
   *
   * @param {Object} request - The request object to the server
   * @param {Object} response - express response object
   *
   * @return {Object} - response object
   */
  signout: async (request, response) => {
    const authHeader = request.headers.authorization;
    const token = authHeader.split(' ')[1];
    const { id } = request.user;

    await BlacklistedTokens.create({ token, userId: id });

    return response.status(200).json({ status: 'success', message: 'User successfully logged out' });
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
   * @return {Object} - response object
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
   * @return {Object} response object
   */
  twitterLogin: async (request, response) => {
    const { status, data } = await createOrFindUser(request.user);

    return response.status(status).json({ status: 'success', data });
  },
};
