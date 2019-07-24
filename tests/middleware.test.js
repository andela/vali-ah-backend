import { should } from 'chai';
import errorHandler from '../src/middlewares/errorHandler';

should();

const error = new Error('403 Error');

describe('Error Handler', () => {
  let req, res, next;

  beforeEach(() => {
    res = {
      status(code) {
        res.status = code;
        return res;
      },
      json(data) {
        res.body = data;
      }
    };
    req = {};
    next = () => {};
  });

  it('should return 500 error status', async () => {
    errorHandler(new Error('Test Error'), req, res, next);

    res.status.should.eql(500);
  });

  it('should return specified error for production', async () => {
    process.env.NODE_ENV = 'production';

    error.status = 403;

    errorHandler(error, req, res, next);

    res.status.should.eql(403);
    res.body.errors.error.should.eql({});
  });

  it('should return specified error for development', async () => {
    process.env.NODE_ENV = 'dev';

    error.status = 403;

    errorHandler(error, req, res, next);

    res.status.should.eql(403);
    res.body.errors.error.should.not.eql({});
  });
});
