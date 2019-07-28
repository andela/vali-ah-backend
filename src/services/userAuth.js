import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import database from '../models/index';
import doesUserexist from '../helpers/userHelper';
import notification from './notification';

dotenv.config();

const saltRounds = 10;
const { Users } = database;

/**
 * Signs in a user
 *
 * @param {Object} request - The request object to the server
 * @param {Object} response - The response object from the server
 * @param {Function} next - Calls the express error handler
 *
 * @return {Void} - Returns nothing
 */
export const createUser = async (request, response, next) => {
  const userPresent = await doesUserexist(request.body.email);
  if (!userPresent) {
    const hash = await bcrypt.hashSync(request.body.password, saltRounds);
    const userData = {
      ...request.body,
      password: hash,
    };

    const createdUser = await Users.create(userData);
    const { password, ...newUser } = createdUser.dataValues;
    const host = request.get('host');
    notification.emit('notification', {
      type: 'accountActivation',
      payload: [{
        email: newUser.email,
        name: newUser.firstName,
        verificationLink: `https://${host}/profile`
      }]
    });

    const token = jwt.sign(
      { id: createdUser.dataValues.id },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    response.status(200).json({
      status: 'success',
      data: { user: newUser, token }
    });
  } else {
    const err = new Error();
    err.message = 'you are already registered';
    err.status = 409;
    next(err);
  }
};

/**
 * Creates a user
 *
 * @param {Object} request - The request object to the server
 * @param {Object} response - The response object from the server
 * @param {Function} next - Calls the express error handler
 *
 * @return {Void} - Returns nothing
 */
export const checkinUser = async (request, response, next) => {
  const userData = { ...request.body };
  const createdUser = await Users.findOne({
    where: {
      email: userData.email
    }
  });

  if (createdUser === null) {
    const err = new Error();
    err.message = 'you are not yet registered';
    err.status = 400;
    next(err);
  } else {
    const passwordTrue = await bcrypt.compareSync(
      userData.password,
      createdUser.dataValues.password
    );

    if (passwordTrue) {
      const { password, ...user } = createdUser.dataValues;
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
    } else {
      const err = new Error();
      err.message = 'invalid user name or password';
      err.status = 400;
      next(err);
    }
  }
};
