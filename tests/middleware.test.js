import { should } from 'chai';

import errorHandler from '../src/middlewares/errorHandler';

should();


describe('Error Handler', () => {
  let request, response, next, nextCall = 0;
  const error = new Error('Error');

  beforeEach(() => {
    response = {
      status(code) {
        response.status = code;
        return response;
      },
      json(data) {
        response.body = data;
      }
    };
    request = {};
    next = () => { nextCall += 1; };
  });

  it('should return 500 error status', async () => {
    errorHandler(error, request, response, next);

    response.status.should.eql(500);
  });

  it('should not return stack trace with specified error for production', async () => {
    process.env.NODE_ENV = 'production';
    error.status = 403;

    errorHandler(error, request, response, next);

    response.status.should.eql(403);
    response.body.status.should.eql('error');
    response.body.error.message.should.eql('Error');
    response.body.error.should.not.have.property('trace');
  });

  it('should return stack trace with specified error for development', async () => {
    process.env.NODE_ENV = 'development';
    error.status = 403;

    errorHandler(error, request, response, next);

    response.status.should.eql(403);
    response.body.status.should.eql('error');
    response.body.error.message.should.eql('Error');
    response.body.error.should.have.property('trace');
  });

  it('should call next when resopnse headers have already been sent', async () => {
    response.headersSent = true;

    errorHandler(error, request, response, next);

    nextCall.should.equal(1);
    response.should.not.have.property('body');
  });
});
