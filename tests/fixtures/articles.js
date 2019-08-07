import faker from 'faker';
import uuid from 'uuid';
import { users } from './users';

const comment = {
  content: faker.lorem.sentence(),
  userId: faker.random.uuid()
};

const tag = ['motivation', 'health', 'emotion'];

const articles = users.map(({ id }) => ({
  id: uuid(),
  authorId: id,
  tag: faker.random.arrayElement(tag),
  title: faker.lorem.sentence(),
  summary: faker.lorem.sentence(),
  body: faker.lorem.text()
}));

const profileData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

const category = tag.map(() => ({
  id: uuid(),
  category: faker.random.arrayElement(tag),
  description: faker.lorem.sentence()
}));

const categoriesId = category.map(categoriesTab => categoriesTab.id);
const duplicatedCategoriesId = Array(6)
  .fill(categoriesId)
  .join()
  .split(',');

const articleCategories = articles.map(({ id, authorId }) => ({
  id: uuid(),
  authorId,
  articleId: id,
  categoryId: faker.random.arrayElement(duplicatedCategoriesId)
}));

const votes = articles.map(({ authorId }, i, array) => ({
  id: uuid(),
  userId: authorId,
  articleId: i > 3 ? array[array.length - 1].id : array[1].id,
  upVote: i > 3
}));

const downVotes = articles.map(({ authorId }, i, array) => ({
  id: uuid(),
  userId: authorId,
  articleId: i > 4 ? array[3].id : array[2].id,
  upVote: false
}));

const invalidArticleId = '00000000-0000-1000-a000-000000000000';

export {
  comment,
  articles,
  votes,
  invalidArticleId,
  downVotes,
  profileData,
  category,
  articleCategories
};
