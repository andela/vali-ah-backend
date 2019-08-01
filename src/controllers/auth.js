import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import database from '../models';
import { getExistingUser } from '../helpers/auth';
import notification from '../services/notification';

dotenv.config();

const saltRounds = 10;
const { Users } = database;

/**
 * Handles user signup.
 *
 * @param {Object} request - The requst object.
 * @param {Object} response - The server response object
 * @param {Function} next - To call the express error handler
 *
 * @return {Object} - Sends information to the server
 */
export const signup = async (request, response, next) => {
  try {
    const existingUser = await getExistingUser(request.body.email);

    if (existingUser) {
      const err = new Error();
      err.message = 'you are already registered';
      err.status = 409;
      return next(err);
    }

    const hash = await bcrypt.hashSync(request.body.password, saltRounds);
    const userData = {
      ...request.body,
      password: hash,
    };

    const createdUser = await Users.create(userData);
    const { password, ...newUser } = createdUser.dataValues;
    const host = request.get('host');
    const token = jwt.sign(
      { id: createdUser.dataValues.id },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    notification.emit('notification', {
      type: 'accountActivation',
      payload: [{
        email: newUser.email,
        name: newUser.firstName,
        verificationLink: `https://${host}/profile`
      }]
    });

    return response.status(200).json({
      status: 'success',
      data: { user: newUser, token }
    });
  } catch (error) {
    const err = new Error();
    err.message = error.message;
    err.status = 500;
    next(err);
  }
};


/**
 * Handles user signin
 *
 * @param {Object} request - The request object to the server
 * @param {Object} response - The response object from the server
 * @param {Function} next - Calls the express error handler
 *
 * @return {Object} - Sends information to the server
 */
export const signin = async (request, response, next) => {
  try {
    const userData = { ...request.body };
    const existingUser = await getExistingUser(request.body.email);

    if (!existingUser) {
      const err = new Error();
      err.message = 'you are not yet registered';
      err.status = 404;
      return next(err);
    }

    const isRealPassword = await bcrypt.compareSync(
      userData.password,
      existingUser.dataValues.password
    );

    if (!isRealPassword) {
      const err = new Error();
      err.message = 'invalid user name or password';
      err.status = 400;
      return next(err);
    }

    const { password, ...user } = existingUser.dataValues;
    const token = jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    response.status(200).json({
      status: 'success',
      data: {
        user, token
      }
    });
  } catch (error) {
    const err = new Error();
    err.message = error.message;
    err.status = 500;
    next(err);
  }
};

export default { signup, signin };
