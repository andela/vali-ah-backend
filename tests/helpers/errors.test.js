/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';

import { ApplicationError } from '../../src/helpers/errors';

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiHttp);

should();

describe('Errors helper', () => {
  describe('Application Error', () => {
    it('should set status as 500 if error code is not defined', async () => {
      const error = new ApplicationError();
      error.should.have.property('status');
      error.status.should.eql(500);
    });

    it('should set status to defined status', async () => {
      const error = new ApplicationError(404);

      error.should.have.property('status');
      error.status.should.eql(404);
    });

    it('should set error message', async () => {
      const error = new ApplicationError(404, 'not found');

      error.should.have.property('message');
      error.message.should.eql('not found');
    });
  });
});
