import Debug from 'debug';
import { config } from 'dotenv';

config();
const debug = Debug('dev');

export default (err, request, response, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  let errorMessage = {};

  if (response.headersSent) {
    return next(err);
  }

  if (!isProduction) {
    debug(err.stack);
    errorMessage = err;
  }

  return response.status(err.status || 500).json({
    status: 'error',
    error: {
      message: err.message,
      ...(!isProduction && { trace: errorMessage })
    }
  });
};
