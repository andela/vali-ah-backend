import Debug from 'debug';
import { config } from 'dotenv';

config();
const debug = Debug('dev');
// eslint-disable-next-line no-unused-vars
export default (err, request, response, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  let errorMessage = {};

  if (!isProduction) {
    debug(err.stack);
    errorMessage = err;
  }

  return response.status(err.status || 500).json({
    errors: {
      message: err.message,
      error: errorMessage
    }
  });
};
