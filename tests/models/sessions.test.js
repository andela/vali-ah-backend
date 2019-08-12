/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';

import Models from '../../src/models';
import { users } from '../fixtures/users';

chai.use(chaiAsPromised);

const { Sessions, Users } = Models;

should();

describe('Users Model', () => {
  before(async () => {
    await Users.destroy({ where: {} });
    await Users.bulkCreate(users);
  });

  afterEach(async () => {
    await Users.destroy({ where: {} });
  });

  it('should save session', async () => {
    const sessionId = faker.random.uuid();
    const { id: userId } = users[0];
    const session = await Sessions.saveSession({ userId, sessionId });

    session.userId.should.eql(userId);
  });

  it('should update session for existing user', async () => {
    const { id: userId } = users[0];
    const sessionId = 'faker.random.uuid()';
    const session = await Sessions.saveSession({ userId, sessionId });

    session.userId.should.eql(userId);
    session.sessionId.should.eql(sessionId);
  });
});
