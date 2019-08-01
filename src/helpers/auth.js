import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generates user token
 *
 * @function
 *
 * @param {string} user - token payload
 *
 * @returns {string} - token
 */
export const generateAuthToken = ({ id, isAdmin }) => jwt.sign(
  { id, isAdmin },
  process.env.SECRET_KEY,
  { expiresIn: '24h' }
);

export default { generateAuthToken };
