/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';
import uuid from 'uuid/v4';
import Debug from 'debug';

const debug = Debug('dev');
const tags = ['motivation', 'health', 'emotion'];

export default {
  up: async (queryInterface) => {
    try {
      const users = await queryInterface.bulkInsert(
        'Users',
        Array(18)
          .fill(0)
          .map(() => ({
            id: uuid(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            userName: faker.internet.userName(),
            email: faker.internet.email().toLowerCase(),
            password: faker.internet.password()
          })),
        { returning: true }
      );

      const articles = await queryInterface.bulkInsert(
        'Articles',
        users.map(({ id: userId }) => ({
          id: uuid(),
          authorId: userId,
          title: faker.lorem.sentence(),
          summary: faker.lorem.sentences(),
          body: faker.lorem.text()
        })),
        { returning: true }
      );

      const category = await queryInterface.bulkInsert(
        'Categories',
        tags.map(tag => ({
          id: uuid(),
          category: tag,
          description: faker.lorem.sentences()
        })),
        { returning: true }
      );

      const categoriesId = category.map(categoriesTab => categoriesTab.id);
      const duplicatedCategoriesId = Array(6)
        .fill(categoriesId)
        .join()
        .split(',');
      const usersId = users.map(user => user.id);

      const articleCategories = await queryInterface.bulkInsert(
        'ArticleCategories',
        articles.map(({ id: articlesId }) => ({
          id: uuid(),
          authorId: faker.random.arrayElement(usersId),
          articleId: articlesId,
          categoryId: faker.random.arrayElement(duplicatedCategoriesId)
        })),
        { returning: true }
      );

      await queryInterface.bulkInsert(
        'Comments',
        articles.map(({ id: articleId, authorId }) => ({
          id: uuid(),
          content: faker.lorem.sentence(15),
          userId: authorId,
          articleId
        }))
      );

      const Subscriptions = await queryInterface.bulkInsert(
        'Subscriptions',
        category.map(() => ({
          id: uuid(),
          userId: users[0].id,
          categoryId: faker.random.arrayElement(categoriesId)
        })),
        { returning: true }
      );

      return Promise.resolve(articleCategories, Subscriptions);
    } catch (error) {
      debug(error);
    }
  },
  down: async queryInterface => queryInterface.bulkDelete('Users', null, {})
};
