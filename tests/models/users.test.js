/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';

import Models from '../../src/models';
import { users } from '../fixtures/users';

chai.use(chaiAsPromised);

const { Users } = Models;

should();

describe('Users Model', () => {
  beforeEach(async () => {
    await Users.destroy({ where: {} });
    await Users.bulkCreate(users);
  });

  after(async () => {
    await Users.destroy({ where: {} });
  });

  it('should throw an error for a user that doesn\'t exists', async () => {
    (Users.getSingleUser(faker.random.uuid())).should.eventually.rejected;
  });

  it('should get users follower for existing users', async () => {
    const searchData = { data: { user: users[0].id } };
    const followers = await Users.getUserFollowers(searchData);

    followers.should.not.empty;
  });

  it('should get users follower for existing users', async () => {
    const searchData = { data: { user: users[0].id } };
    const followers = await Users.getUserFollowings(searchData);

    followers.should.not.empty;
  });

  it('should throw error for non existing users', async () => {
    const searchData = { data: { user: faker.random.uuid() } };

    (Users.getUserFollowers(searchData)).should.eventually.rejected;
  });
});
