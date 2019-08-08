/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import Models from '../../src/models';
import { sessions } from '../fixtures/session';

chai.use(chaiAsPromised);

const { Notifications } = Models;

should();

describe('Notifications Model', () => {
  before(async () => {
    await Notifications.destroy({ where: {}, truncate: true });
    await Notifications.bulkCreate(sessions);
  });

  after(async () => {
    await Notifications.destroy({ where: {}, truncate: true });
  });

  it('should get batched notifications', async () => {
    const followers = await Notifications.getBatchedNotifications({});

    followers.should.be.an('array');
  });
});
