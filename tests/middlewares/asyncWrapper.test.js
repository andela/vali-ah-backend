/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';

import asyncWrapper from '../../src/middlewares/asyncWrapper';

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiHttp);

should();


describe('async validator', () => {
  const request = {};
  it('should catch all errors', () => {
    const response = { status() {}, json() {} };

    const functionToWrap = sinon.stub().throws();
    const next = sinon.spy();
    const wrapped = asyncWrapper(functionToWrap);

    wrapped(request, response, next);
    next.should.be.calledOnce;
  });

  it('should return status and data', async () => {
    const response = { status() {}, json() {} };

    const functionToWrap = sinon.stub().returns({ status: 201, data: {} });
    const next = sinon.spy();
    const wrapped = asyncWrapper(functionToWrap);
    const statusStub = sinon.stub(response, 'status').callsFake(next);

    await wrapped(request, response, next);

    statusStub.should.be.calledOnce;
  });
});
