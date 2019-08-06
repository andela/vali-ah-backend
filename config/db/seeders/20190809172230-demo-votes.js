/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';
import uuid from 'uuid/v4';
import Debug from 'debug';
import randomBool from 'random-bool';

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
        slug: faker.lorem.sentence(),
        body: faker.lorem.text()
      })), { returning: true });

      const articleIds = await articles.map(eachArticle => eachArticle.id);
      const userIds = await users.map(eachUser => eachUser.id);


      const votes = await queryInterface.bulkInsert('Votes', articles.map(({ id: authorId }) => ({
        id: uuid(),
        articleId: articleIds[Math.floor(Math.random() * 3)],
        userId: userIds[Math.floor(Math.random() * 5)],
        upVote: randomBool(),
        authorId
      })), { returning: true });
      return Promise.resolve(votes);
    } catch (error) {
      debug(error);
    }
  },
  down: async (queryInterface) => {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Votes', null, {});
  }
};
