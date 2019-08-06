/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { onConnection, notificationHandler } from '../../src/helpers/socket';
import { sessions } from '../fixtures/session';

chai.use(chaiAsPromised);
chai.use(sinonChai);

chai.use(chaiAsPromised);

should();

describe('Socket.io', () => {
  const io = { to() {}, emit() {} };

  before(() => {
    sinon.stub(io, 'to').returnsThis();
    sinon.stub(io, 'emit').returnsThis();
  });

  it('should return socketId', async () => {
    const connectionData = {
      request: { _query: { userId: faker.random.uuid() } },
      id: faker.random.uuid()
    };

    const socketId = await onConnection(io)(connectionData);

    socketId.should.be.eql(connectionData.id);
  });

  it('should return socketId', async () => {
    const handler = notificationHandler(io);

    const notificationData = handler(sessions);

    notificationData.should.be.an('array');
  });
});
