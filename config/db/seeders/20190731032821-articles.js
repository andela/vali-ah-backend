/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';
import uuid from 'uuid/v4';
import Debug from 'debug';

const debug = Debug('dev');

export default {
  up: async (queryInterface) => {
    try {
      const users = await queryInterface.bulkInsert('Users', Array(5).fill(0).map(() => ({
        id: uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password()
      })), { returning: true });

      const articles = await queryInterface.bulkInsert('Articles', users.map(({ id: userId }) => ({
        id: uuid(),
        authorId: userId,
        title: faker.lorem.sentence(),
        summary: faker.lorem.sentences(),
        body: faker.lorem.text()
      })), { returning: true });


      return Promise.resolve(articles);
    } catch (error) {
      debug(error);
    }
  },
  down: async queryInterface => queryInterface.bulkDelete('Users', null, {})
};
