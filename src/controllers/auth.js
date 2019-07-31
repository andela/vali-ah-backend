import dotenv from 'dotenv';

import database from '../models';
import { NotFoundError, ApplicationError } from '../helpers/errors';
import { generateAuthToken } from '../helpers/auth';
import notification from '../services/notification';
import { facebookAuth, googleAuth, createOrFindUser } from '../services/auth';

dotenv.config();
const { Users } = database;

export default {
  /**
   * Handles user signup.
   *
   * @param {Object} request - the request object to the server
   *
   * @return {Object} - response object
   */
  signup: async (request) => {
    const existingUser = await Users.getExistingUser(request.body.email);

    if (existingUser) throw new ApplicationError(409, 'you are already registered');

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

    return { status: 201, data: { user: newUser, token } };
  },

  /**
   * Handles user signin
   *
   * @param {Object} request - the request object to the server
   *
   * @return {Object} - response object
   */
  signin: async (request) => {
    const { password, email } = request.body;
    const user = await Users.getExistingUser(email);

    if (!user) throw new NotFoundError('you are not yet registered');

    const isRealPassword = await Users.comparePassword(password, user.password);

    if (!isRealPassword) throw new ApplicationError(400, 'invalid user name or password');

    delete user?.dataValues?.password;

    const token = generateAuthToken(user);

    return { status: 200, data: { user, token } };
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
   *
   * @return {Object} - response object
   */
  socialLogin: async (request) => {
    const { provider } = request.params;
    const providerHandle = {
      facebook: facebookAuth,
      google: googleAuth
    };
    const userDetails = await providerHandle[provider](request.body);
    const user = await createOrFindUser(userDetails);
    return { ...user };
  },

  /**
   * Handles user sign in using their twitter credentials
   *
   * @function
   *
   * @param {Object} request object
   *
   * @return {Object} response object
   */
  twitterLogin: async (request) => {
    const user = await createOrFindUser(request.user);
    return { ...user };
  }
};
