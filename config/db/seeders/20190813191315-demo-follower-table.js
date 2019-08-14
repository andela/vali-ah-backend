/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';
import uuid from 'uuid/v4';
import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface) => {
    try {
      const users = await queryInterface.bulkInsert('Users', Array(10).fill(0).map(() => ({
        id: uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password()
      })), { returning: true });

      await queryInterface.bulkInsert('Articles', users.map(({ id: userId }) => ({
        id: uuid(),
        authorId: userId,
        title: faker.lorem.sentence(),
        summary: faker.lorem.sentences(),
        slug: faker.lorem.sentence(),
        body: faker.lorem.text(),
        status: 'published'
      })), { returning: true });

      const userIds = await users.map(eachUser => eachUser.id);

      await queryInterface.bulkInsert('Articles', users.map(user => ({
        id: uuid(),
        authorId: userIds[0],
        title: faker.lorem.sentence() + user.id,
        summary: faker.lorem.sentences(),
        slug: faker.lorem.sentence(),
        body: faker.lorem.text(),
        status: 'published'
      })), { returning: true });

      await queryInterface.bulkInsert('Followers', users.map(({ id: followerId }, index) => ({
        id: uuid(),
        followeeId: (index > 3) ? userIds[0] : userIds[1],
        followerId
      })), { returning: true });

      await queryInterface.bulkInsert('Followers', users.map(({ id: followerId }, index) => ({
        id: uuid(),
        followeeId: (index > 3) ? userIds[3] : userIds[4],
        followerId
      })), { returning: true });

      await queryInterface.bulkInsert('Followers', users.map(({ id: followerId }, index) => ({
        id: uuid(),
        followeeId: (index > 3) ? userIds[0] : userIds[1],
        followerId
      })), { returning: true });
    } catch (error) {
      debug(error);
    }
  },

  down: async (queryInterface) => {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Followers', null, {});
  }
};
